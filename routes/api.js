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
      if (err) return res.json({docs: '', message: err});
      return res.json({docs: docs, message: 'Success'});
    });
  });
  
  //get book comments
  app.get('/api/books/:book', (req, res) => {
    Books.findOne({title: req.params.book.replace(/_/g, ' ')}, (err, docs) => {
      if (err) return res.json({docs: '', message: err});
      if (docs) {
        return res.json({docs: docs, message: 'Found book'});
      } else {
        return res.json({docs: '', message: 'Book not found'});
      }
    });
  });
  
  //new book
  app.post('/api/books', (req, res) => {
    Books.findOne({title: req.body.title}, (err, docs) => {
      if (err) return res.json({docs: '', message: err});
      if (docs) {
        return res.json({docs: '', message: `${req.body.title} already in library`});
      } else {
        let new_book = new Book({
          title: req.body.title
        });
        Books.insertOne(new_book, (err, docs) => {
          if (err) return res.json({docs: '', message: err});
          return res.json({docs: docs.ops.pop(), message: 'Added new book'});
        });
      }
    });
  });
  
  //delete book
  app.delete('/api/books/:book', (req, res) => {
    let query = {_id: ObjectId(req.body._id)};
    Books.findOneAndDelete(query, (err, docs) => {
      if (err) return res.json({docs: '', message: err});
      return res.json({docs: docs, message: 'Deleted _id: ' + req.body._id});
    });
  });
  
  //new comment
  app.post('/api/books/:book', (req, res) => {
    let query = {_id: ObjectId(req.body.book._id)};
    let old_comments = req.body.book.comments;
    let new_comment = {body:req.body.comment, date:new Date()};
    let new_comments = [...old_comments, new_comment];
    let update = {
      $push:{
        comments: new_comment
      }
    };
    
    Books.findOneAndUpdate(query, update, {returnOriginal: false}, (err, docs) => {
      if (err) return res.json({docs: '', message: err});
      return res.json({docs: docs.value, message: 'Successfully updated'});
    });
  });
  
  app.delete('/api/books', (req, res) => {
    Books.remove({}, (err, docs) => {
      if (err) return res.json({docs: '', message: err});
      return res.json({docs: '', message: 'All clear'});
    });
  });
    
  app.use((req, res) => res.status(404).type('text').send('Not Found'));
};