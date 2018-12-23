import React from 'react';
import { Link } from 'react-router-dom';

const HeaderRow = () => {
  return(
    <div className="row justify-content-between">
      <div className="col-sm-1"></div>
      <div className="col-sm-11">
        <div className="row border-bottom">
          <div className="col-sm-2">Id</div>
          <div className="col-sm-8">Title</div>
          <div className="col-sm-2 text-center">Comments</div>
        </div>
      </div>
    </div>
  );
};

const DataRow = (props) => {
  return(props.books.map(el =>
    <div key={el.key} className="row justify-content-between">
      
      <div className="col-sm-1">
        <button 
          id={'delete-' + el.title.replace(/\s/g, '_')} 
          className="btn btn-sm btn-outline-danger fas fa-times" 
          type="button" 
          onClick={props.delete} 
        />               
      </div>
      
      <div className="col-sm-11 route-link">
        
        <Link id={'book-' + el.title.replace(/\s/g, '_')} to={el.route} className="route-link" onClick={props.click}>
          <div className="row book-link justify-content-between border-bottom">
            <div className="col-sm-2">{el._id.slice(-4)}</div>
            <div className="col-sm-8">{el.title}</div>
            <div className="col-sm-2 text-center">{el.comments.length ? el.comments.length : '0'}</div>
          </div>
        </Link>
        
      </div>
    </div>
  ));
};

const BookList = (props) => {
  return(
    <div className="container mt-4">
      <h4 className="mt-4">Home</h4>
      <HeaderRow />
      <DataRow 
        books={props.books || []}
        click={props.click}
        delete={props.deleteBook}
      />
    </div>
  );
};

export { BookList };