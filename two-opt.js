

function two_opt(hospitals, residents, callback) {

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
	residents = newRes;
} 

module.exports = {
	run: two_opt
};