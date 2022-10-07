import React from "react";

const Button = ({ children, type, color, onClick }) => {
  return (
    <button type={type} className={"button " + color} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
