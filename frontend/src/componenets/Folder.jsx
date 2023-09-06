import React from "react";
import { Card } from "react-bootstrap";

const Folder = ({ name }) => {
  return (
    <Card
      className="p-2 w-100 d-flex align-items-center justify-content-center customHover"
      style={{ minHeight: "200px" }}
    >
      <h2 className="text-center">{name}</h2>
    </Card>
  );
};

export default Folder;
