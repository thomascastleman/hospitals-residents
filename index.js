
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

// legality function specific to client implementation
exports.checkLegality = function(hosp, res) {
	return undefined;
};

// soft cost specific to client implementation
exports.softCost = function(hosp, res) {
	return undefined;
};

// check both absolute legality and client-defined legality
function checkFinalLegality(hosp, res) {
	return res.ghost || (hospital.num_subscribed <= hospital.max_capacity && exports.checkLegality(hosp, res));
}

// check absolute soft cost (ghost = 0) and client-defined
function finalSoftCost(hosp, res) {
	return res.ghost ? 0 : exports.softCost(hosp, res);
}


// client: ----------------------------------------------------

var castleman = exports;


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

var offering = castleman.initHospital(0, 25, new Offering(10, 17));
console.log(offering);

var student1 = castleman.initResident(0, new Student(11, 17, [0, 1, 2, 3, 4]));
console.log(student1);


// legality defined in terms of my specific problem:
castleman.checkLegality = function(offering, student) {
	return student.grade >= offering.grade && student.age >= offering.age;
};

console.log(castleman.checkLegality(offering, student1));