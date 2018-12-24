/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*
*   ----[EXAMPLE TEST]----
*   Each test should completely test the response of the API end-point including response status code!
  
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
*  
*   ----[END of EXAMPLE TEST]----
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const url = '/api/books';
const t = [
  {title: 'Mocha & Chai Testing'},
  {title: ''},
  {comment: 'Chai test comment'}
];

suite('Functional Tests', () => {

  suite('Routing tests', () => {
  
    suite('POST /api/books with title => create book object/expect book object', () => {
      
      test('Test POST /api/books with title', (done) => {
        chai.request(server)
        .post(url)
        .send(t[0])
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body.docs);
          assert.equal(t[0].title, res.body.docs.title);
          assert.property(res.body.docs, 'title');
          assert.property(res.body.docs, '_id');
          done();
        });
      
      });
      
      test('Test POST /api/books with no title given', (done) => {
        chai.request(server)
        .post(url)
        .send(t[1])
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.equal(res.body.message, 'No title given');
          done();
        });
      });
      
    });


    suite('GET /api/books => array of books', () => {
      
      test('Test GET /api/books', (done) => {
        chai.request(server)
        .get(url)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body.docs);
          res.body.docs.forEach(el => {
            assert.property(el, '_id');
            assert.property(el, 'title');
            assert.property(el, 'commentCount');
          });
          done();
        });
      });
      
    });


    suite('GET /api/books/[id] => book object with [id]', () => {
      
      test('Test GET /api/books/[id] with id not in db', (done) => {
        chai.request(server)
        .get(url + '/5c11bde95a58c33e638e4a93')
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.equal(res.body.message, '_id not in database');
          done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db', (done) => {
        chai.request(server)
        .get(url + '/5c200aab9062010c4db980f8')
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body.docs);
          assert.property(res.body.docs, '_id');
          assert.property(res.body.docs, 'title');
          assert.property(res.body.docs, 'comments');
          assert.typeOf(res.body.docs.comments, 'array');
          done();
        });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', () => {
      
      test('Test POST /api/books/[id] with comment', (done) => {
        chai.request(server)
        .post(url + '/5c200aab9062010c4db980f8')
        .send(t[2])
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body.docs);
          assert.property(res.body.docs, '_id');
          assert.property(res.body.docs, 'title');
          assert.property(res.body.docs, 'comments');
          assert.typeOf(res.body.docs.comments, 'array');
          done();
        });
      });
      
    });

  });

});
