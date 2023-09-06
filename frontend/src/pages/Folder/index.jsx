import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../axios";
import { toast } from "react-toastify";
import CustomSpinner from "../../componenets/Spinner";

const Index = () => {
  const { pathname } = useLocation();
  const folder = pathname.split("/")[2];

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async (folder) => {
    setLoading(true);
    axiosInstance
      .get(`/image/${folder}`)
      .then(({ data }) => {
        if (data.success) {
          setData(data.data);
        } else {
          toast.error(data.message);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData(folder);
  }, [folder]);

  return (
    <div>
      <Container>
        {loading ? (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "100vh" }}
          >
            <CustomSpinner />
          </div>
        ) : (
          <>
            <h1 className="display-5 mt-4">{folder} /</h1>
            <Row className="mt-3">
              {data.map((dataitem, key) => (
                <Col md={3} key={key} className="my-3">
                  <CustomCard data={dataitem} />
                </Col>
              ))}
            </Row>
          </>
        )}
      </Container>
    </div>
  );
};

const CustomCard = ({ data }) => {
  const navigate = useNavigate();
  return (
    <Card className="customHover" onClick={() => navigate(`/image/${data.id}`)}>
      <Card.Img src={data.url} style={{ height: "300px", width: "100%" }} />
      <Card.Body>
        <Card.Title>{data.name}</Card.Title>
      </Card.Body>
    </Card>
  );
};

export default Index;
