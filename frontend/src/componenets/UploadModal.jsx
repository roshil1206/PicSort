import React, { useRef, useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import axiosInstance from "../axios";
import { toast } from "react-toastify";

const UploadModal = ({ show, onClose }) => {
  const [image, setImage] = useState();
  const [loading, setLoading] = useState();

  const inputRef = useRef(null);

  const handleUpload = () => {
    inputRef.current?.click();
  };

  const handleimage = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleSaveImage = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", image);
    axiosInstance
      .post("/image/upload", formData)
      .then(({ data }) => {
        if (data.success) {
          toast.success(data.data.message);
          onClose();
          setImage();
          setLoading(false);
        } else {
          toast.error(data.message);
          setLoading(false);
        }
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      })
      .catch((error) => {
        toast.error("Invalid file type.");
        setLoading(false);
        setImage();
      });
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Upload Image</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {image && (
          <div>
            <p variant="body1" sx={{ marginTop: "10px", marginBottom: "10px" }}>
              Uploaded Image
            </p>
            <img
              src={URL.createObjectURL(image)}
              alt="Uploaded"
              style={{ maxWidth: "100%" }}
            />
          </div>
        )}

        <input
          ref={inputRef}
          className="d-none"
          type="file"
          onChange={handleimage}
        />
        <button
          onClick={handleUpload}
          className="btn btn-outline-primary mt-3"
          disabled={loading}
        >
          {image ? "Change Image" : "Upload Image"}
        </button>
      </Modal.Body>
      <Modal.Footer>
        {loading ? (
          <Spinner />
        ) : (
          <Button variant="primary" onClick={handleSaveImage} disabled={!image}>
            Save Image
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default UploadModal;
