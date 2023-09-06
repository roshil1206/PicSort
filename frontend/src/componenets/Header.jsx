import React, { useState } from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import UploadModal from "./UploadModal";

const Header = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <UploadModal show={show} onClose={handleClose} />
      <Container>
        <Navbar.Brand href="">PicSort</Navbar.Brand>
        <Nav className="mr-auto">
          <Button variant="light" onClick={handleShow}>
            Upload Image
          </Button>
          <Button variant="Secondary" onClick={logout}>
            Logout
          </Button>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
