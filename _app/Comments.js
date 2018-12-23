import React from 'react';

const Comment = (props) => {
  return(props.comments.map((el,i) => 
    <div key={'comment_' + i} className="mb-2 border-bottom">
      <div>{el.body}</div>
      <small>{new Date(el.date).toLocaleString()}</small>
    </div>
  ));
};

const Comments = (props) => {
  return(
    <div className="container mt-4">
      <h4 className="mt-4">Comments</h4>
      <div className="d-flex justify-content-between align-items-center w-100">
        <div>{props.book.title}</div>
        <div>{props.book._id}</div>
        <form>
          <div className="input-group input-group-sm ht-2 ta-w-xl">
            <div className="input-group-prepend h-100">
              <span className="input-group-text h-100">Comment</span>
            </div>
            <textarea className="form-control h-100" name="comment" value={props.comment} onChange={props.change} required />
            <div className="input-group-append h-100">
              <button id="newComment" className="btn btn-sm btn-primary h-100" onClick={props.submit}>Add</button>
            </div>
          </div>
        </form>
      </div>
      
      <div className="d-flex flex-column">
        {props.book.comments.length ? (
          <Comment comments={props.book.comments} />
        ) : (
          <div>
            <h6>No Comments</h6>
          </div>
        )}
      </div>
    </div>
  );
};

export { Comments };