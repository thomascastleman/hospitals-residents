
var two_opt = require('./two-opt.js');
var csp = require('./csp.js');

// find matching using an initial matching and 2-opt optimization
exports.findMatching = function(hospitals, residents, callback) {
	// ensure necessary function definitions have been filled out by package user
	checkFuncDefinitions();

	// check if hospitals given can possibly hold all residents given (barring constraints)
	var pass = maxCapacityCheck(hospitals, residents);

	// callback on error if failed to pass
	if (!pass) {
		callback("No solution possible.");
	} else {
		addIDs(hospitals, residents);

		// try to generate initial random matching (pass err if no solution found)
		csp.run(hospitals, residents, function(err) {
			if (err) {
				callback(err);
			} else {
				// optimize found solution using 2-opt
				two_opt.run(hospitals, residents, function() {
					callback();
				});
			}
		});
	}
};

// add properties to an instance of the client-defined "hospital" class
exports.initHospital = function(_max_capacity, object) {
	return Object.assign({
		max_capacity: _max_capacity,
		num_subscribed: 0,
		assigned_ids: []
	}, object);
}

// add necessary properties to an instance of the client-defined "resident" class
exports.initResident = function(_capacity_value, object) {
	return Object.assign({
		assigned_id: undefined,
		capacity_value: _capacity_value
	}, object);
}

// allow user to pass in legality definition
exports.checkLegality = undefined;

// allow user to pass in own soft cost definition
exports.softCost = undefined;

// check both absolute legality and client-defined legality
global.finalCheckLegality = function(hosp, res) {
	return res.ghost || exports.checkLegality(hosp, res);
}

// check absolute soft cost (ghost = 0) and client-defined
global.finalSoftCost = function(hosp, res) {
	return res.ghost ? 0 : exports.softCost(hosp, res);
}

// ensure all client-defined functions are filled out
function checkFuncDefinitions() {
	if (exports.checkLegality == undefined || exports.softCost == undefined) {
		throw "checkLegality(h, r) or softCost(h, r)  is undefined!";
	}
}

// add ID properties to each entity
function addIDs(hospitals, residents) {
	for (var i = 0; i < hospitals.length; i++) {
		hospitals[i].id = i;
	}
	for (var i = 0; i < residents.length; i++) {
		residents[i].id = i;
	}
}

// check if there is enough total capacity to fit number of residents
function maxCapacityCheck(hospitals, residents) {
	// determine total capacity hospitals can hold
	var totalHospitalCapacity = 0;
	for (var i = 0; i < hospitals.length; i++) {
		totalHospitalCapacity += hospitals[i].max_capacity;
	}

	// determine number of resident capacity "units"
	var totalResidentCapacity = 0;
	for (var i = 0; i < residents.length; i++) {
		totalResidentCapacity += residents[i].capacity_value;
	}

	// return assertion that hospitals can hold all resident units
	return totalResidentCapacity <= totalHospitalCapacity;
}