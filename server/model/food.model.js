const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const foodSchema = new Schema({
    logno: {type: Number, require: true},
    content: [{
      logname: {type: String, require: true},
      logorg: {type: String, require: true},
    }],
    image: [{
      url: {type: String, require: true},
      filehash : {type: String, require: true},
    }],
    item: [{
      loghash: {type: String, require: true},
      logdate: {type: String, require: true},
    }],
    section: [{
      // transactionhash: {type: String, require: true},
      title: {type: String, require: true},
      begin: {type: String, require: true},
      end: {type: String, require: true},
      url: {type: String, require: true},
      urlhash: {type: String, require: true},
      filehash : {type: String, require: true},
    }],
    },
    { timestamps: true }
  );

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;