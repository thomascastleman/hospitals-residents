
var two_opt = require('./two-opt.js');
var csp = require('./csp.js');

// find matching using an initial matching and 2-opt optimization
exports.findMatching = function(hospitals, residents, callback) {
	global.checkFuncDefinitions();
	csp.run(hospitals, residents, function() {
		two_opt.run(hospitals, residents, function() {
			callback();
		});
	});
};

// add properties to an instance of the client-defined "hospital" class
exports.initHospital = function(_id, _max_capacity, object) {
	return Object.assign({
		id: _id,
		max_capacity: _max_capacity,
		num_subscribed: 0
	}, object);
}

// add necessary properties to an instance of the client-defined "resident" class
exports.initResident = function(_id, object) {
	return Object.assign({
		id: _id,
		hospital_id: undefined
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
global.checkFuncDefinitions = function() {
	if (exports.checkLegality() == undefined || exports.softCost() == undefined) {
		throw "checkLegality(h, r) or softCost(h, r)  is undefined!";
	}
}