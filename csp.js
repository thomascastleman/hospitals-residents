

function backtracking(index, hospitals, residents) {
	if (index < residents.length) {
		var res = residents[index];

		// try with each hospital
		for (var i = 0; i < hospitals.length; i++) {
			var hosp = hospitals[i];

			// if match found locally 
			if (global.finalCheckLegality(hosp, res) && hosp.num_subscribed < hosp.max_capacity) {
				res.hospital_id = hosp.id;
				hosp.num_subscribed++;

				// if rest of solution valid, allow
				if (backtracking(index + 1, hospitals, residents)) {
					return true;
				} else {
					hosp.num_subscribed--;
				}
			}
		}
		// backtrack if no solution found this deep
		return false;
	} else {
		// if end reached, solution found
		return true;
	}
}

function runBacktracking(hospitals, residents, callback) {
	backtracking(0, hospitals, residents);
	callback();
}

module.exports = {
	run: runBacktracking
};