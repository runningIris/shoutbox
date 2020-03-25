const redis = require('redis');
const db = redis.createClient();

class Entry {
  constructor(obj) {
    for (let key in obj) {
      this[key] = obj[key];
    }
  }
  
  save(fn) {
    const entryJSON = JSON.stringify(this);
    db.lpush('entries', entryJSON, err => {
      if (err) return fn(err);
      fn();
    });
  }
  
  static getRange(from, to, fn) {
    db.lrange('entries', from, to, (err, items) => {
      if (err) return fn(err);
      const entries = items.map(item => JSON.parse(item));
      fn(null, entries);
    });
  }
  
  static count(fn) {
    db.llen('entries', fn);
  }
}

module.exports = Entry;