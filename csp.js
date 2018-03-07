
// solve a subproblem of the initial matching recursively
function backtracking(index, hospitals, residents) {
	if (index < residents.length) {
		var res = residents[index];

		// try with each hospital
		for (var i = 0; i < hospitals.length; i++) {
			var hosp = hospitals[i];

			// if match found locally 
			if (global.finalCheckLegality(hosp, res) && hosp.num_subscribed < hosp.max_capacity) {
				// assign resident
				res.hospital_id = hosp.id;
				hosp.resident_ids.push(res.id);
				hosp.num_subscribed++;

				// if rest of solution valid, allow
				if (backtracking(index + 1, hospitals, residents)) {
					return true;
				} else {
					// remove assignment
					hosp.num_subscribed--;
					hosp.resident_ids.splice(hosp.resident_ids.indexOf(res.id), 1);

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

// get initial acceptable matching using recursive backtracking
function runBacktracking(hospitals, residents, callback) {
	backtracking(0, hospitals, residents);
	callback();
}

module.exports = {
	run: runBacktracking
};