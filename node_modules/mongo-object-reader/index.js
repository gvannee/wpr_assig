/**
 * returns a creates a new ObjectID
 */
const createObjectID = () => {
  let timestamp = ((new Date().getTime() / 1000) | 0).toString(16);
  return (
    timestamp +
    "xxxxxxxxxxxxxxxx"
      .replace(/[x]/g, () => {
        return ((Math.random() * 16) | 0).toString(16);
      })
      .toLowerCase()
  );
};

/**
 *
 * @param {*} ObjectID
 */
const isValidObjectID = (ObjectID) => {
  const checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
  return checkForHexRegExp.test(ObjectID);
};

/**
 * 
 * @param {*} ObjectID 
 */
const readObjectID = (ObjectID) => {
  if (!isValidObjectID(ObjectID)) {
    throw new Error("Not a valid ObjectID");
  }

  const timeStamp = {};
  const random = {};
  const incrementValue = {};

  timeStamp.hex = ObjectID.slice(0, 8);
  random.hex = ObjectID.slice(8, 18);
  incrementValue.hex = ObjectID.slice(18, 24);

  timeStamp.value = parseInt(timeStamp.hex, 16);
  timeStamp.createDate = new Date(timeStamp.value);
  random.value = parseInt(random.hex, 16);
  incrementValue.value = parseInt(incrementValue.hex, 16);

  return { ObjectID, timeStamp, random, incrementValue };
};

module.exports = { createObjectID, readObjectID, isValidObjectID };
