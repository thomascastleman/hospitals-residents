

function two_opt(hospitals, residents, callback) {
	addGhostResidents(hospitals, residents);
	var temperature = 100.0;
	var rate = 0.9999;

	while (temperature > 0.00001) {
		var ind = getRandomIndices(residents.length);

		// get random pairs
		var resA = residents[ind.index1];
		var hospA = hospitals[resA.hospital_id];

		var resB = residents[ind.index2];
		var hospB = hospitals[resB.hospital_id];

		// if swap legal
		if (global.finalCheckLegality(hospA, resB) && global.finalCheckLegality(hospB, resA)) {
			// calculate costs
			var prevCost = global.finalSoftCost(hospA, resA) + global.finalSoftCost(hospB, resB);
			var swapCost = global.finalSoftCost(hospA, resB) + global.finalSoftCost(hospB, resA);
			
			// if swap better, execute
			if (swapCost < prevCost || Math.random() * 100 < temperature) {
				resA.hospital_id = hospB.id;
				resB.hospital_id = hospA.id;
			}
			// decrease temperature
			temperature *= rate;
		}
	}
	removeGhostResidents(hospitals, residents);
	callback();
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

// add necessary ghosts to meet every hospitals capacity
function addGhostResidents(hospitals, residents) {
	for (var i = 0; i < hospitals.length; i++) {
		var hosp = hospitals[i];

		// while capacity not met, fill with ghosts
		while (hosp.num_residents < hosp.max_capacity) {
			residents.push({ ghost: true, hospital_id: hosp.id });
			hosp.num_residents++;
		}
	}
}

// remove all ghosts
function removeGhostResidents(hospitals, residents) {
	var newRes = [];
	for (var i = 0; i < residents.length; i++) {
		if (!residents[i].ghost) {
			// if not ghost, add to persisting list
			newRes.push(residents[i]);
		} else {
			// remove ghost
			hospitals[residents[i].hospital_id].num_residents--;
		}
	}
	residents.splice(0, residents.length);
	residents.push.apply(residents, newRes);

} 

module.exports = {
	run: two_opt
};