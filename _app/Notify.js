import React from 'react';

const Notify = (props) => {
  return(
    <div className={props.message ? 'show-notify' : 'hide-notify'}>
      <div className="d-flex justify-content-between">
        <span>{props.message}</span>
        {props.message ? (
          <span><button className="btn btn-sm btn-danger fas fa-times" type="button" onClick={props.dismiss} /></span>
        ) : (
          <span></span>
        )}
      </div>
    </div>
  );
};

export { Notify };