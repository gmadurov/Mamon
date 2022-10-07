import PropTypes from "prop-types";
import React, { useState } from "react";
const HoverDropdown = ({ dropText, items }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="dropdown">
      <div
        aria-haspopup="true"
        aria-controls="dropdown-menu4"
        onMouseEnter={() => setShow(true)}
        // onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
      >
        {dropText}
      </div>
      <div className="dropdown-menu" id="dropdown-menu4" role="menu">
        <div
          className="dropdown-items"
          style={{ textAlign: "center", display: show ? "block" : "none" }}
        >
          {items}
        </div>
      </div>
    </div>
  );
};
HoverDropdown.propTypes = {
  dropText: PropTypes.any.isRequired,
  items: PropTypes.any,
};
export default HoverDropdown;
