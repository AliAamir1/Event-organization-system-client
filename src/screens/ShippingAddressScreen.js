import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { Store } from "../Store";
import CheckoutSteps from "../components/CheckoutSteps";
import { useParams } from "react-router-dom";
import Calendar from "../components/Calendar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SpecialArrangements from "../components/SpecialArrangements";
import { Modal } from "react-bootstrap";
export default function ShippingAddressScreen() {
  const [showModal, setShowModal] = useState(false); // for special Arrangements
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;
  const { id } = useParams();
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const handleShowModal = () => setShowModal(true); // model for special Arrangements
  const handleCloseModal = () => setShowModal(false);

  const [country, setCountry] = useState("");
  useEffect(() => {
    localStorage.setItem("arrangementsPrice", 0);
    if (!userInfo) {
      navigate("/signin?redirect=/shipping");
    }
  }, [userInfo, navigate]);
  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: {
        fullName,
        address,
        city,
        postalCode,
        country,
      },
    });
    localStorage.setItem(
      "shippingAddress",
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
        country,
      })
    );
    navigate(`/${id}/payment`);
  };

  const handleSpecialArrangements = () => {
    alert("handling arrangements");
  };
  return (
    <div>
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        dialogClassName="modal-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ marginLeft: "38%" }}>
            Special Arrangements
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontSize: "20px" }}>
          <SpecialArrangements
            eventId={id}
            handleCloseModal={handleCloseModal}
          />
        </Modal.Body>
      </Modal>

      <Helmet>
        <title>Provide Your Details</title>
      </Helmet>
      <CheckoutSteps step1 step2></CheckoutSteps>
      <Form onSubmit={submitHandler}>
        <h1 className="my-3">
          Select Venue Availability and Provide your detials
        </h1>
        <Row>
          <Col md={4}>
            <div
              className="container small-container"
              style={{
                marginTop: "1rem",
              }}
            >
              <Form.Label>Booking Date</Form.Label>
              <Calendar eventId={id} />
              <Button
                variant="primary"
                onClick={handleShowModal}
                style={{
                  marginTop: "1rem",
                }}
              >
                Add Special Arrangements
              </Button>
            </div>
          </Col>
          <Col md={4}>
            <div className="container small-container">
              <Form.Group className="mb-3" controlId="fullName">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="address">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </Form.Group>
            </div>
          </Col>
          <Col md={4}>
            <div className="container small-container">
              <Form.Group className="mb-3" controlId="city">
                <Form.Label>City</Form.Label>
                <Form.Control
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="postalCode">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="country">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
              </Form.Group>
            </div>
          </Col>
        </Row>
        <div className="mb-3 text-center">
          <Button variant="primary" type="submit">
            Continue
          </Button>
        </div>
      </Form>
    </div>
  );
}
