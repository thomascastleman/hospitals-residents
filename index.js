
var two_opt = require('./two-opt.js');
var csp = require('./csp.js');

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

// allow user to pass in own soft cost definition
exports.softCost = function() { return undefined; };

// allow user to pass in legality definition
exports.checkLegality = function() { return undefined; };

// check both absolute legality and client-defined legality
global.finalCheckLegality = function(hosp, res) {
	return res.ghost || exports.checkLegality(hosp, res);
}

// check absolute soft cost (ghost = 0) and client-defined
global.finalSoftCost = function(hosp, res) {
	return res.ghost ? 0 : exports.softCost(hosp, res);
}

exports.findMatching = function(hospitals, residents) {
	global.checkFuncDefinitions();
	csp.run(hospitals, residents, function() {
		two_opt.run(hospitals, residents, function() {
			console.log("Matching found.");
		});
	});
};

// ensure all client-defined functions are filled out
global.checkFuncDefinitions = function() {
	if (exports.checkLegality() == undefined || exports.softCost() == undefined) {
		throw "checkLegality(h, r) or softCost(h, r)  is undefined!";
	}
}


// ----------------------------- client: ish

var castleman = exports;

castleman.checkLegality = function(h, r) {
	return true;
}

castleman.softCost = function(h, r) {
	return 0.0;
}

// client defined offering (hosp) class
function Offering(grade, age) {
	this.grade = grade;
	this.age = age;
}

// client defined student (res) class
function Student(grade, age, rank) {
	this.grade = grade;
	this.age = age;
	this.rank = rank;
}

var stus = [];
var offs = [];

for (var i = 0; i < 30; i++) {
	stus.push(castleman.initResident(i, new Student(11, 17, [0, 1, 2])));
}


for (var i = 0; i < 10; i++) {
	offs.push(castleman.initHospital(i, 3, new Offering(10, 17)));
}

castleman.findMatching(offs, stus);

for (var h = 0 ; h < offs.length; h++) {
	var hosp = offs[h];
	console.log("Hospital: ");
	console.log(hosp);

	console.log("Residents:");
	for (var r = 0; r < stus.length; r++) {
		var res = stus[r];
		if (res.hospital_id == hosp.id) {
			console.log(res);
		}
	}

	console.log();
}