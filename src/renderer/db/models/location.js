const LinvoDB = require('./db');

const LocationSchema = {
  title: String,
  capacity: String
};
const LocationOptions = {};

const Location = new LinvoDB('item', LocationSchema, LocationOptions);

export default Location;
