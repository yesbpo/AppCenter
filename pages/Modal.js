import React, { useState } from "react";
function Modal({ show, onClose, title, data }) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <span className="close" onClick={onClose}>&times;</span>
          <h2>{title}</h2>
        </div>
        <div className="modal-content">
          {data}
        </div>
      </div>
    </div>
  );
}

export {Modal};