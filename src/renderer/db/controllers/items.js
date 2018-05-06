import sim from 'string-similarity';
import { map } from 'async';
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
  },
  /**
   * @return Object
   * @return Object.exact
   * @return Object.possible
   */
  findDuplicates() {
    const exact = [];
    const possible = [];
    return new Promise((resolve, reject) => {
      Item.find({}, (err, items) => {
        if (err) return reject(err);
        items.forEach((item) => {
          const curExact = [];
          const curPossible = [];
          items.forEach((nestedItem) => {
            if (item._id === nestedItem._id) return;
            const curSim = sim.compareTwoStrings(item.title, nestedItem.title);
            if (curSim >= 0.98) curExact.push(nestedItem);
            if (curSim >= 0.75) curPossible.push(nestedItem);
          });
          if (curExact.length > 0) {
            curExact.unshift(item);
            exact.push(curExact);
          }
          if (curPossible.length > 0) {
            curPossible.unshift(item);
            possible.push(curPossible);
          }
        });
        return resolve({ exact, possible });
      });
    });
  },
  /**
   * @param Array array of duplicates
   */
  mergeDuplicates(duplicates) {
    duplicates.splice(duplicates.length - 1, 1);
    return new Promise((resolve, reject) => {
      map(
        duplicates,
        (item, cb) =>
          this.destroyItem(item._id)
            .then(() => {
              cb(null, 'ok');
            })
            .catch((e) => cb(e)),
        (err, results) => {
          if (err) return reject(err);
          console.log(results);
          return resolve('Merge succ');
        }
      );
    });
  },
  deleteAllItems() {
    return new Promise((resolve, reject) => {
      Item.remove({}, { multi: true }, (err, numRemoved) => {
        if (err) return reject(err);
        return resolve(numRemoved);
      });
    });
  }
};
