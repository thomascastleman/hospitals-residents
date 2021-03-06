# hospitals-residents

www.npmjs.com/package/hospitals-and-residents

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

Initially, make sure to include the module at some point:
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
In order to instantiate objects to pass to the matching algorithm, they must first be modified in order to ensure they have certain basic properties. Each hospital-entity must have a maximum capacity, and each resident-entity must have a capacity value. <br><br>
To handle this modification, objects should be processed through the module's `init` functions while being instantiated.<br>
i.e.
```javascript
// initHospital( <MAX CAPACITY>, <CUSTOM OBJECT> );
var hospital1 = hr.initHospital(40, new Hospital([15, 2, 7], 5));
```
or for resident-entities:
```javascript
// initResident( <CAPACITY VALUE>, <CUSTOM OBJECT> );
var resident1 = hr.initResident(1, new Resident([3, 18, 36], 7));
```

In the case of the resident, the capacity value designates the number of capacity "units" this resident should represent. For instance, a single resident with capacity value 3 cannot be assigned to a hospital with only 2 remaining seats. This is considered a capacity violation. This functionality is useful for situations where resident entities themselves represent groups rather than single entities.

#### Matching
And finally, to calculate a matching solution, call `findMatching`. 
```javascript
hr.findMatching( [ array of hospitals ], [ array of residents ], function(error) {
	// handle error here
});
```

An error will be thrown if the total capacity of all hospitals cannot hold the total capacity of all residents, or if the backtracking algorithm finds no acceptable solution.

#### Settings

To access the package settings, check out `hr.settings`. This can be used to change the `rate` or `threshold` attributes used in 2-opt optimization. Setting `hr.settings.logging = true;` will enable logging to the console throughout the matching process and can aid in debugging.

##### To Note:
- The algorithm will operate on the objects themselves and will assign each resident-entity a pair id under the property `assigned_id`.
- At any point in the matching, an array ID's of all resident-entities assigned to any given hospital-entity will be maintained under its `assigned_ids` attribute.
