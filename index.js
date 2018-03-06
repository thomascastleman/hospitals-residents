
var two_opt = require('./two-opt.js');
var csp = require('./csp.js');

global.checkLegality = undefined;
global.softCost = undefined;

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
	csp.run(hospitals, residents, function() {
		two_opt.run(hospitals, residents, function() {
			console.log("Matching found.");
		});
	});
};


// ----------------------------- client: ish

var castleman = exports;

castleman.checkLegality = function() {
	return true;
}

castleman.softCost = function() {
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


csp.run(offs, stus, function() {
	console.log("CSP finished.");
	two_opt.run(offs, stus, function() {
		console.log("2-opt finished.");
		console.log(stus);
	});
});