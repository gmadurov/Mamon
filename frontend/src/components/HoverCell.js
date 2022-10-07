import React, { useState } from "react";
import PropTypes from "prop-types";

const HoverCell = ({ dropText, style,  items }) => {
  const [show, setShow] = useState(false);
  return (
    <td
      className="dropdown "
      style={ { display: "table-cell" }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onClick={() => setShow(!show)}
    >
      <div aria-haspopup="true" aria-controls="dropdown-menu">
        <p>{dropText} </p>
      </div>
      <div
        className="dropdown-menu"
        id="dropdown-menu"
        role="menu"
        style={{ textAlign: "center", display: show ? "block" : "none" }}
      >
        <div className="dropdown-items">{items}</div>
      </div>
    </td>
  );
};
HoverCell.propTypes = {
  dropText: PropTypes.any.isRequired,
  items: PropTypes.any,
};
export default HoverCell;
