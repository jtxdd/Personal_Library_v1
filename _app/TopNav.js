import React from 'react';
import { NavLink } from 'react-router-dom';

const TopNav = (props) => {
  return(
    <nav className="navbar navbar-dark bg-dark justify-content-between">
      <NavLink to="/">
        <h3>Personal Library</h3>
      </NavLink>
      <div>
        <button type="button" className="btn btn-sm btn-danger" onClick={props.clearAll}>Clear All</button>
      </div>
      {props.showInput ? (  
        <form>
          <div className="input-group input-group-sm">
            <div className="input-group-prepend">
              <span className="input-group-text">Title</span>
            </div>
            <input className="form-control" name="title" value={props.title} onChange={props.change} required />
            <div className="input-group-append">
              <button id="newBook" className="btn btn-sm btn-primary" onClick={props.submit}>Add</button>
            </div>
          </div>
        </form>
      ) : (
        <span></span>
      )}
    </nav>
  );
};

export { TopNav };