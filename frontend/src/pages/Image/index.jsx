import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../axios";
import {
  Button,
  Card,
  Col,
  Container,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner,
} from "react-bootstrap";

const Index = () => {
  const { pathname } = useLocation();
  const id = pathname.split("/")[2];

  const [imageData, setImageData] = useState();
  const [text, setText] = useState();
  const [showModal, setShowModal] = useState(false);
  const [noText, setNoText] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = async (id) => {
    axiosInstance.get(`/image/image/${id}`).then(({ data }) => {
      if (data.success) {
        setImageData(data.data);
      }
    });
  };

  const fetchText = async () => {
    setShowModal(true);
    axiosInstance.post("/image/getText", { id: id }).then(({ data }) => {
      if (data.success) {
        if (data.data) setText(data.data);
        else {
          setNoText(true);
        }
        return;
      }
      setNoText(true);
    });
  };

  const onClose = () => {
    setShowModal(false);
    setText();
    setNoText(false);
  };

  useEffect(() => {
    fetchData(id);
  }, [id]);

  return (
    <div>
      <Container>
        <Card className="w-100 h-100 p-3 mt-3 w-80">
          <img src={imageData?.url} />
          <Button onClick={fetchText} className="mt-3">
            Fetch Text
          </Button>
        </Card>
      </Container>
      <Modal show={showModal} onHide={onClose}>
        <ModalHeader closeButton>
          <Modal.Title>Upload Image</Modal.Title>
        </ModalHeader>
        <ModalBody>
          {text ? (
            text
          ) : (
            <div className="d-flex align-items-center justify-content-center flex-column">
              {noText ? (
                "No text Found"
              ) : (
                <>
                  <Spinner />
                  <p>Please wait while we process the image.</p>
                </>
              )}
            </div>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
};

export default Index;
