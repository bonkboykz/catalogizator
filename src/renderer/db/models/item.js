const LinvoDB = require('./db');

const ItemSchema = {
  title: String,
  type: String,
  location: String
};

const ItemOptions = {};

const Item = new LinvoDB('item', ItemSchema, ItemOptions);

export default Item;
