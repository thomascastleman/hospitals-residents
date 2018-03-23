
var two_opt = require('./two-opt.js');
var csp = require('./csp.js');

// find matching using an initial matching and 2-opt optimization
exports.findMatching = function(hospitals, residents, callback) {
	checkFuncDefinitions();
	addIDs(hospitals, residents);
	csp.run(hospitals, residents, function() {
		two_opt.run(hospitals, residents, function() {
			callback();
		});
	});
};

// add properties to an instance of the client-defined "hospital" class
exports.initHospital = function(_max_capacity, object) {
	return Object.assign({
		max_capacity: _max_capacity,
		num_subscribed: 0,
		resident_ids: []
	}, object);
}

// add necessary properties to an instance of the client-defined "resident" class
exports.initResident = function(_capacity_value, object) {
	return Object.assign({
		hospital_id: undefined,
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