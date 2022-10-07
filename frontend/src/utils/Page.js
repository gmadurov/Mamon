import React from "react";

const Page = ({ children, className, ...rest }) => {
  return (
    <div className="columns is-centered">
      <div className={className ? className : "column is-10"} {...rest}>
        {children}
      </div>
    </div>
  );
};

export default Page;
