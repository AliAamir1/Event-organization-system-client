import axios from "axios";
import { useContext, useEffect, useReducer, useRef, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import { Helmet } from "react-helmet-async";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { Link, useNavigate, useParams } from "react-router-dom";
import Rating from "../components/Rating";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { FloatingLabel, Form } from "react-bootstrap";
import { Message } from "@material-ui/icons";
import React, { Fragment } from "react";
import { useLocation } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import ViewSpecialArrangements from "../components/ViewSpecialArrangements";
import { Modal } from "react-bootstrap";
import MessageUI from "./MessageUI";
import CarouselComponent from "../components/CloudinaryCarousel";
import { useLayoutEffect } from "react";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, event: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "REFRESH_PRODUCT":
      return { ...state, event: action.payload };
    case "CREATE_REQUEST":
      return { ...state, loadingCreateReview: true };
    case "CREATE_SUCCESS":
      return { ...state, loadingCreateReview: false };
    case "CREATE_FAIL":
      return { ...state, loadingCreateReview: false };
    default:
      return state;
  }
};

function ProductScreen() {
  const location = useLocation(); // to get the location object of the browser
  const url = location.pathname; // to get the path name you are on
  const eventslug = url.split("/")[2]; // to get the slug of the event you are on
  const [vendorId, setVendorId] = useState("");
  //console.log("prinintg slugs", eventslug);
  const [messageState, setMessageState] = useState(false);
  let reviewsRef = useRef();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [showModal, setShowModal] = useState(false); // for special Arrangements
  const handleShowModal = () => setShowModal(true); // model for special Arrangements
  const handleCloseModal = () => setShowModal(false);

  const navigate = useNavigate();
  const params = useParams();
  const { slugs } = params;
  const [{ loading, error, event, loadingCreateReview }, dispatch] = useReducer(
    reducer,
    {
      event: [],
      loading: true,
      error: "",
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(`/api/events/slugs/${slugs}`);
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }

      //setEvents(result.data);
    };
    fetchData();
  }, [slugs]);

  // to get the vendor Id
  useEffect(() => {
    const fetchEventData = async () => {
      const response = await axios.get(
        `http://localhost:5000/api/events/slugs/${eventslug}`
      );
      setVendorId(response.data.vendorId);
    };
    fetchEventData();
  }, [eventslug]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === event._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/events/${event._id}`);
    if (data.stock < quantity) {
      window.alert("Sorry Event is out of stock");
      return;
    }
    ctxDispatch({ type: "CART_ADD_ITEM", payload: { ...event, quantity } });
    navigate("/cart");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error("Please enter comment and rating");
      return;
    }
    try {
      const { data } = await axios.post(
        `/api/events/${event._id}/reviews`,
        { rating, comment, name: userInfo.name, userId: userInfo._id },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({
        type: "CREATE_SUCCESS",
      });
      toast.success("Review submitted successfully");
      event.reviews.unshift(data.review);
      event.numberOfReviews = data.numberOfReviews;
      event.rating = data.rating;
      dispatch({ type: "REFRESH_PRODUCT", payload: event });
      window.scrollTo({
        behavior: "smooth",
        top: reviewsRef.current.offsetTop,
      });
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: "CREATE_FAIL" });
    }
  };

  const messagingHandler = () => {
    setMessageState(true);
  };

  const closeMessaginHandler = () => {
    setMessageState(false);
  };
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return messageState ? (
    <MessageUI
      close={closeMessaginHandler}
      eventslug={eventslug}
      vendorId={vendorId}
    />
  ) : loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <Fragment>
      {/* <div>
        <IconButton onClick={messagingHandler}>
          <Message fontSize="large" />
        </IconButton>
      </div> */}
      <div>
        <Modal
          show={showModal}
          onHide={handleCloseModal}
          dialogClassName="modal-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Special Arrangements</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ fontSize: "20px" }}>
            <ViewSpecialArrangements
              eventId={event._id}
              handleCloseModal={handleCloseModal}
            />
          </Modal.Body>
        </Modal>
        <Row>
          <Col md={6}>
            <>
              {event.images.length <= 1 ? (
                <img
                  className="img-large"
                  src={selectedImage || event.image}
                  alt={event.title}
                ></img>
              ) : (
                <CarouselComponent images={event.images} />
              )}
            </>
          </Col>
          <Col md={4}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Helmet>
                  <title>{event.title}</title>
                </Helmet>
                <h1>{event.title}</h1>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating
                  rating={event.rating}
                  numReviews={event.numberOfReviews}
                ></Rating>
              </ListGroup.Item>
              <ListGroup.Item> Price: PKR: {event.price}</ListGroup.Item>
              <ListGroup.Item>
                Description: <p>{event.description}</p>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  variant="primary"
                  onClick={handleShowModal}
                  style={{
                    marginTop: "1rem",
                  }}
                >
                  View Special Arrangements
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={2}>
            <Card>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>PKR {event.price}/-</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {!event.suspended ? (
                          <>
                            <Badge bg="success">Available</Badge>
                          </>
                        ) : (
                          <Badge bg="danger">Unavailable</Badge>
                        )}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {!event.suspended && (
                    <ListGroup.Item>
                      <div className="d-grid">
                        <Button onClick={addToCartHandler} variant="primary">
                          Add to Cart
                        </Button>
                      </div>
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
          {/* <div>
            <Row noGutters> 
              <Col md={3}>
                <h2> Contat the Vendor </h2>
              </Col>
              <Col md={2}>
                <IconButton onClick={messagingHandler}>
                <Message fontSize="large" />
                </IconButton>
              </Col>
            </Row>
          </div> */}
        </Row>

        <Row noGutters>
          <Col md={3}>
            <span style={{ display: "flex", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>Contact Vendor:</h3>
              <IconButton onClick={messagingHandler}>
                <Message fontSize="large" />
              </IconButton>
            </span>
          </Col>
        </Row>

        <div className="my-3" style={{ border: "1px solid black" }}>
          <h2 className="text-center" ref={reviewsRef}>
            Reviews
          </h2>
          <div className="mb-3">
            {event.reviews.length === 0 && (
              <MessageBox>There is no review</MessageBox>
            )}
          </div>
          <ListGroup>
            {event.reviews.map((review) => (
              <ListGroup.Item key={review._id}>
                <strong>{review.name}</strong>
                <Rating rating={review.rating} caption=" "></Rating>
                <p>{review.createdAt.substring(0, 10)}</p>
                <p>{review.comment}</p>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <div className="my-3">
            {userInfo ? (
              <form onSubmit={submitHandler}>
                <h4>Write a customer review</h4>
                <Form.Group className="mb-3" controlId="rating">
                  <Form.Label>Rating</Form.Label>
                  <Form.Select
                    aria-label="Rating"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  >
                    <option value="">Select...</option>
                    <option value={1}>1- Poor</option>
                    <option value={2}>2- Fair</option>
                    <option value={3}>3- Good</option>
                    <option value={4}>4- Very good</option>
                    <option value={5}>5- Excelent</option>
                  </Form.Select>
                </Form.Group>
                <FloatingLabel
                  controlId="floatingTextarea"
                  label="Comments"
                  className="mb-3"
                >
                  <Form.Control
                    as="textarea"
                    placeholder="Leave a comment here"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </FloatingLabel>

                <div className="mb-3 text-center">
                  <Button disabled={loadingCreateReview} type="submit">
                    Submit
                  </Button>
                  {loadingCreateReview && <LoadingBox></LoadingBox>}
                </div>
              </form>
            ) : (
              <MessageBox>
                Please{" "}
                <Link to={`/signin?redirect=/events/${event.slug}`}>
                  Sign In
                </Link>{" "}
                to write a review
              </MessageBox>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default ProductScreen;
