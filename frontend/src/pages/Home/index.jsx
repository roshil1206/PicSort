import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios";
import Spinner from "../../componenets/Spinner";
import { Col, Container, Row } from "react-bootstrap";
import Folder from "../../componenets/Folder";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  const getTags = async () => {
    setLoading(true);
    axiosInstance
      .get("/image")
      .then(({ data }) => {
        if (data.success) {
          setTags(data.data.tags);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getTags();
  }, []);
  return (
    <div>
      {loading ? (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: "100vh" }}
        >
          <Spinner />
        </div>
      ) : (
        <Container>
          <Row className="mt-3">
            {tags.map((tag, key) => (
              <Col
                md={4}
                key={key}
                onClick={() => navigate(`/folder/${tag}`)}
                className="my-3"
              >
                <Folder name={tag} />
              </Col>
            ))}
          </Row>
        </Container>
      )}
    </div>
  );
};

export default Index;
