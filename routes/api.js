import MongoClient, { ObjectId } from 'mongodb';
const Book = require('../models/Book.js');

module.exports = (app, db) => {
  const Books = db.collection('books');
  const Comments = db.collection('comments');
  
  
  
  //home
  app.get('/', (req, res) => res.sendFile(process.cwd() + '/views/index.html'));
  
  //booklist
  app.get('/api/books', (req, res) => {
    Books.find({}).toArray((err, docs) => {
      if (err) return res.json({docs: '', message: err, status: 500});
      docs.forEach(el => el.commentCount = el.comments.length);
      return res.json({docs: docs, message: 'Success', status: 200});
    });
  });
  
  //get book comments
  app.get('/api/books/:_id', (req, res) => {
    Books.findOne({_id: ObjectId(req.params._id)}, (err, docs) => {
      if (err) return res.json({docs: '', message: err, status: 500});
      if (docs) {
        return res.json({docs: docs, message: 'Found book', status: 200});
      } else {
        return res.status(400).json({docs: '', message: '_id not in database', status: 400});
      }
    });
  });
  
  
  
  
  //new book
  app.post('/api/books', (req, res) => {
    if (req.body.title) {
      Books.findOne({title: req.body.title}, (err, docs) => {
        if (err) return res.json({docs: '', message: err, status: 500});
        if (docs) {
          return res.json({docs: '', message: `${req.body.title} already in library`, status: 400});
        } else {
          let new_book = new Book({
            title: req.body.title
          });
          Books.insertOne(new_book, (err, docs) => {
            if (err) return res.json({docs: '', message: err, status: 500});
            return res.json({docs: docs.ops.pop(), message: 'Added new book', status: 200});
          });
        }
      });
    } else {
      res.statusCode = 400;
      return res.json({docs: '', message: 'No title given', status: 400});
    }
  });
  
  //new comment
  app.post('/api/books/:_id', (req, res) => {
    let query = {_id: ObjectId(req.params._id)};
    let update = { $push:{
      comments: { body: req.body.comment, date: new Date() }
    }};
    
    Books.findOneAndUpdate(query, update, {returnOriginal: false}, (err, docs) => {
      if (err) return res.json({docs: '', message: err, status: 500});
      return res.json({docs: docs.value, message: 'Successfully updated', status: 200});
    });
  });
  
  
  
  
  
  //delete book
  app.delete('/api/books/:_id', (req, res) => {
    let query = {_id: ObjectId(req.params._id)};
    Books.findOneAndDelete(query, (err, docs) => {
      if (err) return res.json({docs: '', message: err, status: 500});
      return res.json({docs: docs, message: 'Deleted _id: ' + req.body._id, status: 200});
    });
  });
  
  app.delete('/api/books', (req, res) => {
    Books.deleteMany({}, (err, docs) => {
      if (err) return res.json({docs: '', message: err, status: 500});
      return res.json({docs: '', message: 'All clear', status: 200});
    });
  });
  
  
    
  app.use((req, res) => res.status(404).type('text').send('Not Found'));
};