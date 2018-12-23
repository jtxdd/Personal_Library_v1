const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const Book = new mongoose.Schema({
  title: { type: String, required: true },
  comments: [{body: String, date:Date}]
});

module.exports = mongoose.model('Book', Book);

//comments: [{body: {type:String}, date:{type:Date, default:Date.now}}]