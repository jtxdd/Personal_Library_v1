import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { BookList } from '../_app/BookList.js';
import { TopNav } from '../_app/TopNav.js';
import { Comments } from '../_app/Comments.js';
import { Notify } from '../_app/Notify.js';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      selected: {},
      title: '',
      comment: '',
      message: ''
    };
    this.getBooks = this.getBooks.bind(this);
    this.postBook = this.postBook.bind(this);
    this.postComment = this.postComment.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyGen = this.handleKeyGen.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleDismiss = this.handleDismiss.bind(this);
    this.handleClearAll = this.handleClearAll.bind(this);
  }
  
  componentDidMount() {
    this.getBooks();
  }
  
  handleChange(e) {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({ [name]: value });
  }
  
  handleKeyGen() {
    const rngChar = () => {
      const rand = Math.floor(Math.random() * 26) + 97;
      return String.fromCharCode(rand);
    };
    let arr = Array(3).fill().map(el => rngChar());
    return arr.join('');
  }
  
  handleDismiss() {
    this.setState(prev => ({ message: !prev.message }));
  }
  
  getBooks() {
    fetch('/api/books').then(res => res.json())
      .then(result => {
        result.docs.forEach(el => el.key = el._id + '_' + this.handleKeyGen());
        result.docs.forEach(el => el.route = '/api/books/' + el._id);
        this.setState({ books: result.docs });
    });
  }
  
  postBook(url, options) {
    fetch(url, options)
      .then(res => res.json())
      .then(result => {
        let inserted = Object.keys(result.docs).length;
        let books = this.state.books;
        
        if (inserted) {
          result.docs.key = result.docs._id + '_' + this.handleKeyGen();
          result.docs.route = '/api/books/' + result.docs._id;
          
          this.setState({
            books: [...books, result.docs],
            title: '', 
            message: result.message
          });
        } else {
          this.setState({ message: result.message });
        }
      });
  }
  
  postComment(url, options) {
    let { books, selected } = this.state;
    
    let bookId = JSON.parse(options.body).book._id;
    let bookIndex = books.findIndex(el => el._id === bookId);
    
    fetch(url, options)
      .then(res => res.json())
      .then(result => {
        if (result.docs) {
          books[bookIndex].comments = result.docs.comments;
          selected.comments = result.docs.comments;
          
          this.setState({
            books: books, 
            selected: selected, 
            message: result.message,
            comment: ''
          });
        } else {
          this.setState({ message: result.message });
        }
      });
  }
  
  handleSubmit(e) {
    e.preventDefault();
    
    let url = '/api/books';
    
    let options = {
      method: 'POST',
      body: {},
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
    };
    
    let submit = {
      newBook:() => {
        options.body = JSON.stringify({title: this.state.title});
        this.postBook(url, options);
      },
      
      newComment:() => {
        url = this.props.location.pathname;
        options.body = JSON.stringify({comment: this.state.comment, book: this.state.selected});
        this.postComment(url, options);
      }
    };
    
    submit[e.target.id]();
  }
  
  handleClick(e) {
    e.preventDefault();
    
    let id = e.currentTarget.id.split('-')[1];
    let selected = this.state.books.find(el => el._id === id);
    this.setState({ selected: selected });
    this.props.history.push(selected.route);
  }
  
  handleDelete(e) {
    let id = e.target.id.split('-');
    let title = id[1].replace(/_/g, ' ');
    let book = this.state.books.find(el => el.title === title);
    let books = this.state.books.filter(el => el._id !== book._id);
    
    let url = '/api/books/' + book._id;
    let confirm = window.confirm(`Deleting ${title}`);
    
    let options = {
      method: 'DELETE',
      body: JSON.stringify({_id: book._id}),
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
    };
    
    if (confirm) {
      fetch(url, options)
        .then(res => res.json())
        .then(result => {
          if (result.docs) {
            this.setState({ books: books, message: result.message });
          } else {
            this.setState({ message: result.message });
          }
        });
    }
  }
  
  handleClearAll() {
    let url = '/api/books';
    let options = {
      method: 'DELETE',
      body: JSON.stringify({}),
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
    };
    let confirm = window.confirm('Deleting all books from library');
    if (confirm) {
      fetch(url, options)
        .then(res => res.json())
        .then(result => {
          if (result.message === 'All clear') {
            this.setState({
              books: [],
              selected: {},
              title: '',
              comment: '',
              message: result.message
            });
          }
        });
    }
  }
  
  render() {
    return(
      <div>
        
        <TopNav 
          title={this.state.title} 
          change={this.handleChange}
          submit={this.handleSubmit}
          showInput={this.props.location.pathname === '/'}
          clearAll={this.handleClearAll}
        />
        
        <Notify message={this.state.message} dismiss={this.handleDismiss} />
        
        <Route exact path="/" render={(props) => 
          <BookList 
            books={this.state.books} 
            click={this.handleClick}
            deleteBook={this.handleDelete}
          />
        }/>
        
        <Route path="/api/books/:book" render={(props) => 
          <Comments 
            {...props}
            book={this.state.selected}
            submit={this.handleSubmit}
            comment={this.state.comment}
            change={this.handleChange}
            /> 
        }/>
      </div>
    );
  }
}

ReactDOM.render((
  <BrowserRouter>
    <Route children={({...rest}) => <App {...rest} /> }/>
  </BrowserRouter>
), document.getElementById('application'));