
// optimize matching for a soft cost
function two_opt(hospitals, residents, callback) {
	var single = true;
	// check if resident situation single or grouped
	for (var i = 0; i < residents.length; i++) {
		if (residents[i].capacity_value != 1) {
			single = false;
			break;
		}
	}

	if (single) {
		singleResidentTwoOpt(hospitals, residents, callback);
	} else {
		groupedResidentTwoOpt(hospitals, residents, callback);
	}
}

// get two random indices that are not the same
function getRandomIndices(num_residents) {
	var possibleIndices = [];
	for (var i = 0; i < num_residents; i++) {
		possibleIndices.push(i);
	}
	var rand1 = possibleIndices[Math.floor(Math.random() * possibleIndices.length)];
	possibleIndices.splice(rand1, 1);
	var rand2 = possibleIndices[Math.floor(Math.random() * possibleIndices.length)];

	return { index1: rand1, index2: rand2 };
}

// SINGLE RESIDENT:

// perform two opt with single resident entities
function singleResidentTwoOpt(hospitals, residents, callback) {
	addSingleGhosts(hospitals, residents);
	var temperature = 100.0;
	var rate = 0.9999;

	while (temperature > 0.00001) {
		var ind = getRandomIndices(residents.length);

		// get random pairs
		var resA = residents[ind.index1];
		var hospA = hospitals[resA.assigned_id];

		var resB = residents[ind.index2];
		var hospB = hospitals[resB.assigned_id];

		// if swap legal
		if (global.finalCheckLegality(hospA, resB) && global.finalCheckLegality(hospB, resA)) {
			// calculate costs
			var prevCost = global.finalSoftCost(hospA, resA) + global.finalSoftCost(hospB, resB);
			var swapCost = global.finalSoftCost(hospA, resB) + global.finalSoftCost(hospB, resA);
			
			// if swap better, execute
			if (swapCost < prevCost || Math.random() * 100 < temperature) {
				// remove previous pairs' id's
				hospB.assigned_ids.splice(hospB.assigned_ids.indexOf(resB.id), 1);
				hospA.assigned_ids.splice(hospA.assigned_ids.indexOf(resA.id), 1);

				// maintain new pairing id's
				hospB.assigned_ids.push(resA.id);
				hospA.assigned_ids.push(resB.id);

				resA.assigned_id = hospB.id;
				resB.assigned_id = hospA.id;
			}
		}

		// decrease temperature
		temperature *= rate;
	}
	removeSingleGhosts(hospitals, residents);
	callback();
}

// add as many ghosts as necessary
function addSingleGhosts(hospitals, residents) {
	for (var i = 0; i < hospitals.length; i++) {
		var hosp = hospitals[i];

		// while capacity not met, fill with ghosts
		while (hosp.num_residents < hosp.max_capacity) {
			residents.push({ ghost: true, assigned_id: hosp.id });
			hosp.num_residents++;
		}
	}
}

// remove ghosts
function removeSingleGhosts(hospitals, residents) {
	var newRes = [];
	for (var i = 0; i < residents.length; i++) {
		if (!residents[i].ghost) {
			// if not ghost, add to persisting list
			newRes.push(residents[i]);
		} else {
			// remove ghost
			hospitals[residents[i].assigned_id].num_residents--;
		}
	}
	residents.splice(0, residents.length);
	residents.push.apply(residents, newRes);
}

// GROUPED RESIDENT:

// perform two opt with grouped residents
function groupedResidentTwoOpt(hospitals, residents, callback) {
	addGroupedGhosts(hospitals, residents);
	var temperature = 100.0;
	var rate = 0.9999;

	while (temperature > 0.00001) {
		var ind = getRandomIndices(residents.length);

		// get random pairs
		var resA = residents[ind.index1];
		var hospA = hospitals[resA.assigned_id];

		var resB = residents[ind.index2];
		var hospB = hospitals[resB.assigned_id];

		// if swap legal
		if (global.finalCheckLegality(hospA, resB) && global.finalCheckLegality(hospB, resA)) {
			// if not both ghosts
			if (!(resA.ghost && resB.ghost)) {
				// if either SAME value or one is ghost and has large enough capacity
				if ((resA.capacity_value == resB.capacity_value) || 
					((resA.ghost && resB.capacity_value <= resA.capacity_value) || (resB.ghost && resA.capacity_value <= resB.capacity_value))) {

					// calculate costs
					var prevCost = global.finalSoftCost(hospA, resA) + global.finalSoftCost(hospB, resB);
					var swapCost = global.finalSoftCost(hospA, resB) + global.finalSoftCost(hospB, resA);
					
					// if swap better, execute
					if (swapCost < prevCost || Math.random() * 100 < temperature) {
						var ghost;

						// remove previous pairs' id's
						if (!resB.ghost) {
							hospB.assigned_ids.splice(hospB.assigned_ids.indexOf(resB.id), 1);
							hospA.assigned_ids.push(resB.id);
							resB.assigned_id = hospA.id;
						} else {
							ghost = resB;
						}

						if (!resA.ghost) {
							hospA.assigned_ids.splice(hospA.assigned_ids.indexOf(resA.id), 1);
							hospB.assigned_ids.push(resA.id);
							resA.assigned_id = hospB.id;
						} else {
							ghost = resA;
						}

						// if one of the pair was a ghost
						if (ghost) {
							var resident = resA == ghost ? resB : resA;
							var hosp = resA == ghost ? hospB : hospA;

							// apply changes to ghosts from each hospital
							ghost.capacity_value -= resident.capacity_value;
							hosp.ghost_resident.capacity_value += resident.capacity_value;
						}
					}

				}
			}
		}

		// decrease temperature
		temperature *= rate;
	}

	removeGroupedGhosts(hospitals, residents);
	callback();
}

// add ghost group to meet every hospital's capacity
function addGroupedGhosts(hospitals, residents) {
	for (var i = 0; i < hospitals.length; i++) {
		var hosp = hospitals[i];

		var ghost = {
			ghost: true,
			assigned_id: hosp.id,
			capacity_value: hosp.max_capacity - hosp.num_subscribed,
		}

		residents.push(ghost);

		hosp.ghost_resident = ghost;
		hosp.num_subscribed = hosp.max_capacity;
	}
}

// remove all ghosts
function removeGroupedGhosts(hospitals, residents) {
	var newRes = [];
	for (var i = 0; i < residents.length; i++) {
		if (!residents[i].ghost) {
			// if not ghost, add to persisting list
			newRes.push(residents[i]);
		}
	}
	residents.splice(0, residents.length);
	residents.push.apply(residents, newRes);

	// remove ghost objects from hospitals
	for (var i = 0; i < hospitals.length; i++) {
		var hosp = hospitals[i];

		hosp.num_subscribed -= hosp.ghost_resident.capacity_value;
		delete hosp.ghost_resident;
	}
} 

module.exports = {
	run: two_opt
};