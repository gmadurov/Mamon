import PropTypes from "prop-types";
import Dropdown from "react-bootstrap/Dropdown";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";

const ClickDropdown = ({ dropText, items }) => {
  return (
    <Dropdown className="d-inline mx-2" style={{ width: "100px" }}>
      <Dropdown.Toggle id="dropdown-autoclose-true">{dropText}</Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown style={{ width: "350px" }}>{items}</Dropdown>
      </Dropdown.Menu>
    </Dropdown>
  );
};

ClickDropdown.propTypes = {
  dropText: PropTypes.string.isRequired,
  items: PropTypes.any.isRequired,
};

export default ClickDropdown;
