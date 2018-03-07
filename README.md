# hospitals-residents

A generalized solution for working with matchings problems similar to the Hospitals & Residents problem. <br><br>
This problem operates on two types of entities, the defining characteristics of which are the following:
- Resident-type
  - a single resident is assigned to a single hospital
- Hospital-type
  - a single hospital may be assigned to many different residents
## Installation

To install the hospitals and residents package and save it into your package.json, type
```
npm install hospitals-and-residents --save
```

## Usage

Initially, make sure to include the module in your entry point file:
```javascript
var hr = require('hospitals-and-residents');
```

#### Entity Definitions
To begin, classes for each type (hospital-type and resident-type) of entity can be written. These implementations differ *vastly* across different applications (students and courses, applicants and universities, residents and hospitals...).<br><br>
e.g. (in this case the original problem is used)
```javascript
function Hospital(_preferences, _minYearsExperience) {
	this.preferences = _preferences;
	this.minYearsExperience = _minYearsExperience;
}

function Resident(_preferences, _yearsExperience) {
	this.preferences = _preferences;
	this.yearsExperience = _yearsExperience;
}
```
In this example, both entities will have a list of ID's ranking their top choices. In addition, a hard constraint of years of experience will be added to demonstrate functionality. <br>
<br>
#### Legality and Cost Functions
Next we must override the unwritten legality and cost functions, which the package uses to construct an acceptable matching and optimize it for cost. 
```javascript
// as long as resident meets the minimum years of experience requirement
hr.checkLegality = function(hosp, res) {
	return res.yearsExperience >= hosp.minYearsExperience;
}

// sum of ratings from each other's preferences
hr.softCost = function(hosp, res) {
	var cost, rating;
	rating = res.preferences.indexOf(hosp.id);
	cost = rating == -1 ? res.preferences.length : rating;

	int = hosp.preferences.indexOf(res.id);
	cost += rating == -1 ? hosp.preferences.length : rating;

	return cost;
}
```

#### Instantiation
In order to instantiate objects to pass to the matching algorithm, they must first be modified in order to ensure they have certain basic properties. For instance, both entities must have ID's, and each hospital-entity must have a maximum capacity. <br><br>
To handle this modification, objects should be processed through the module's `init` functions while being instantiated.<br>
i.e.
```javascript
// initHospital( <ID>, <MAX CAPACITY>, <CUSTOM OBJECT> );
var hospital1 = hr.initHospital(0, 40, new Hospital([15, 2, 7], 5));
```
or for resident-entities:
```javascript
// initResident( <ID>, <CUSTOM OBJECT> );
var resident1 = hr.initResident(24, new Resident([3, 18, 36], 7));
```

#### Matching
And finally, to calculate a matching solution, call `findMatching`. 
```javascript
hr.findMatching( [ array of hospitals ], [ array of residents ], callback );
```
The algorithm will operate on the objects themselves and will assign each resident-entity a pair id under the property `hospital_id`.
