import React from "react";
import Header from "./Header";

const Wrapper = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
};

export default Wrapper;
