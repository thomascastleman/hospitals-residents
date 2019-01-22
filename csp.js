
// solve a subproblem of the initial matching recursively
function backtracking(index, hospitals, residents) {
	if (index < residents.length) {
		var res = residents[index];

		// try with each hospital
		for (var i = 0; i < hospitals.length; i++) {
			var hosp = hospitals[i];

			// if legal and hospital can handle addition of resident with this cap value
			if (global.finalCheckLegality(hosp, res) && hosp.num_subscribed + res.capacity_value <= hosp.max_capacity) {
				// assign resident
				res.assigned_id = hosp.id;
				hosp.assigned_ids.push(res.id);
				hosp.num_subscribed += res.capacity_value;

				// if rest of solution valid, allow
				if (backtracking(index + 1, hospitals, residents)) {
					return true;
				} else {
					// remove assignment
					hosp.num_subscribed -= res.capacity_value;
					hosp.assigned_ids.splice(hosp.assigned_ids.indexOf(res.id), 1);
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
	callback(backtracking(0, hospitals, residents));
}

module.exports = {
	run: runBacktracking
};