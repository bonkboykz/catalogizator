import Item from '../models/item';

export default {
  getList() {
    return new Promise((resolve, reject) => {
      Item.find({}, (err, docs) => {
        if (err) {
          return reject(new Error(err));
        }
        return resolve(docs);
      });
    });
  },
  createItem(data) {
    return new Promise((resolve, reject) => {
      const newItem = new Item({
        title: data.title,
        type: data.type,
        location: data.location
      });
      newItem.save((err) => {
        if (err) return reject(err);
        return resolve(newItem);
      });
    });
  },
  destroyItem(itemId) {
    return new Promise((resolve, reject) => {
      Item.findById(itemId, (err, item) => {
        if (err) return reject(err);
        item.remove((e) => {
          if (e) return reject(e);
          return resolve('Deleted successfully');
        });
      });
    });
  },
  updateItem(updItem) {
    console.log(updItem);
    return new Promise((resolve, reject) => {
      Item.findById(updItem._id, (err, item) => {
        if (err) return reject(err);
        Object.assign(item, updItem).save((e) => {
          if (e) return reject(e);
          return resolve('Updated succ');
        });
      });
    });
  }
};
