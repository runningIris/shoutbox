const redis = require('redis');
const bcrypt = require('bcrypt');
const db = redis.createClient();

class User {
  constructor(obj) {
    for (let key in obj) {
      this[key] = obj[key];
    }
  }
  save(fn) {
    if (this.id) {
      return this.update(this.id);
    }
    db.get('user:ids', (err, id) => {
      if (err) fn(err);
      if (id) {
        db.incr('user:ids', (err, id) => {
          if (err) return fn(err);
          this.id = id;
          this.hashPassword(err => {
            if (err) return fn(err);
            this.update(fn);
          });
        });
      } else {
        db.set('user:ids', 0, err => {
          if (err) fn(err);
        });
      }
    });
  }
  update(fn) {
    db.set('user:id:' + this.name, this.id, err => {
      if (err) return fn(err);
      db.hmset('user:' + this.id, this, fn);
    });
  }
  hashPassword(fn) {
    bcrypt.genSalt(12, (err, salt) => { // 生成有12个字符的盐
      if (err) return fn(err);
      this.salt = salt;
      bcrypt.hash(this.pass, salt, (err, hash) => {
        if (err) return fn(err);
        this.pass = hash;
        fn();
      });
    });
  }
  toJSON() {
    return {
      id: this.id,
      name: this.name
    }
  }
  static getByName(name, fn) {
    User.getId(name, (err, id) => {
      if (err) return fn(err);
      User.get(id, fn);
    });
  }
  static getId(name, fn) {
    db.get('user:id:' + name, fn);
  }
  static get(id, fn) {
    db.hgetall('user:' + id, (err, user) => {
      if (err) return fn(err);
      fn(null, new User(user));
    });
  }
  static authenticate(name, pass, fn) {
    User.getByName(name, (err, user) => {
      if (err) return fn(err);
      if (!user.id) return fn();
      bcrypt.hash(pass, user.salt, (err, hash) => {
        if (err) return fn(err);
        if (hash == user.pass) return fn(null, user);
        fn();
      });
    });
  }
}

module.exports = User;