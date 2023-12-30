import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import Axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils.js";
import { Row, Col } from "react-bootstrap";
export default function SigninScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post("/api/users/signin", {
        email,
        password,
      });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(redirect || "/");
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <div className="mp-neg">
      <Row style={{ height: "80vh" }}>
        <Col md={6}>
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              backgroundImage:
                "url(https://img.freepik.com/premium-vector/event-planner-template-hand-drawn-cartoon-illustration-with-planning-schedule-calendar-concept_2175-7747.jpg)",
              backgroundRepeat: "no-repeat",
              //backgroundColor: theme.palette.grey[50],
              backgroundSize: "cover",
              height: "100%",
              backgroundColor: "#7f7f7f",
              backgroundPosition: "center",
              filter: "blur(0.5px)",
            }}
          >
            <h1>Welcome to Event Organization System</h1>
          </div>
        </Col>
        <Col md={6}>
          <Container className="small-container">
            <Helmet>
              <title>Sign In</title>
            </Helmet>

            <div className="d-flex">
              <div className="w-50">
                <h1 className="my-3">Sign In</h1>
                <Form onSubmit={submitHandler}>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      required
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      required
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>
                  <div className="mb-3">
                    <Button type="submit">Sign In</Button>
                  </div>
                  <div className="mb-3">
                    New customer?{" "}
                    <Link to={`/signup?redirect=${redirect}`}>
                      Create your account
                    </Link>
                  </div>
                </Form>
              </div>
            </div>
          </Container>
        </Col>
      </Row>
    </div>
  );
}
