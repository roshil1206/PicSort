import React from "react";
import { Spinner } from "react-bootstrap";

const CustomSpinner = () => {
  return (
    <div className="d-flex align-items-center justify-content-center">
      <Spinner animation="border" role="status" />
    </div>
  );
};

export default CustomSpinner;
