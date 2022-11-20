mongo-object-reader 
=============

This module allows you to create and parse `ObjectID`s without a reference to the
[mongodb](https://github.com/mongodb/node-mongodb-native) or [bson](https://github.com/mongodb/js-bson)
modules.


## Install
    $ npm install mongo-object-reader

## Usage
```javascript
ES6
import { createObjectID, readObjectID,isValidObjectID }  from 'mongo-object-reader';

const { createObjectID, readObjectID,isValidObjectID }  = require('mongo-object-reader');
//Creates a new immutable `ObjectID` instance based on the current system time.
const ObjectID =  createObjectID() //a valid 24 character `ObjectID` hex string.

//returns boolean
// input - a valid 24 character `ObjectID` hex string.
const isValid = isValidObjectID(ObjectID) 

//returns an object with data
// input - a valid 24 character `ObjectID` hex string.
const objectData  = readObjectID(ObjectID) 

console.log(ObjectID) //ObjectID
console.log(isValid)       // true
console.log(objectData)    /*
{ ObjectID: '5e92d4be2ced3f58d92187f5',
  timeStamp:
   { hex: '5e92d4be',
     value: 1586681022,
     createDate: 1970-01-19T08:44:41.022Z },
  random: { hex: '2ced3f58d9', value: 192958912729 },
  incrementValue: { hex: '2187f5', value: 2197493 } }
*/
```

License
=======
MIT

