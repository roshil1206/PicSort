import React, { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import axiosInstance from "../../axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleDataChange = (event) => {
    setData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const toggleRegister = () => {
    setData({
      email: "",
      password: "",
      confirmPassword: "",
    });
    setIsRegister((current) => !current);
  };

  const handleSubmit = () => {
    if (isRegister) {
      if (data.password !== data.confirmPassword) {
        toast.error("Password and confirm password dosen't match");
        return;
      }
    }
    if (!isRegister) {
      axiosInstance
        .post("/login", { ...data })
        .then(({ data }) => {
          if (data.success) {
            const token = data.data.token;
            localStorage.setItem("token", token);
            window.location.href = "/";
          } else {
            toast.error(data.message);
          }
        })
        .catch((error) => console.log(error));
    } else {
      axiosInstance.post("/register", { ...data }).then(({ data }) => {
        if (data.success) {
          toast.success("Registration successfull");
          setIsRegister(false);
        } else {
          toast.error(data.message);
        }
      });
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center h-100"
      style={{ minHeight: "100vh" }}
    >
      <Card className="p-5">
        <h3 className="text-center display-5 mb-3">
          {isRegister ? "Register" : "Login"}
        </h3>

        <Form.Group
          className="mb-3"
          controlId="formBasicEmail"
          style={{ minWidth: "300px" }}
        >
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            value={data.email}
            onChange={handleDataChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            value={data.password}
            onChange={handleDataChange}
          />
        </Form.Group>
        {isRegister && (
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Reenter Password"
              name="confirmPassword"
              value={data.confirmPassword}
              onChange={handleDataChange}
            />
          </Form.Group>
        )}
        <Button
          variant="primary"
          type="submit"
          style={{ width: "100%" }}
          onClick={handleSubmit}
        >
          {isRegister ? "Register" : "Login"}
        </Button>

        <p className="mt-3 ">
          {!isRegister ? (
            <>
              New user ?{" "}
              <span
                style={{ cursor: "pointer" }}
                className="text-primary"
                onClick={toggleRegister}
              >
                Register here
              </span>
            </>
          ) : (
            <>
              Already User ?{" "}
              <span
                style={{ cursor: "pointer" }}
                className="text-primary"
                onClick={toggleRegister}
              >
                Login
              </span>
            </>
          )}
        </p>
      </Card>
    </div>
  );
};

export default Index;
