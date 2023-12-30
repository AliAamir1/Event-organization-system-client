import React, { useContext, useEffect, useReducer, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils.js";
import Axios from "axios";
import LoadingBox from "../components/LoadingBox";

const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loading: true };
    case "CREATE_SUCCESS":
      return { ...state, loading: false };
    case "CREATE_FAIL":
      return { ...state, loading: false };
    default:
      return state;
  }
};
export default function PlaceOrderScreen() {
  const [arrangementsPrice, setArrangementsPrice] = useState(
    localStorage.getItem("arrangementsPrice") || 0
  );
  const [bid, setBid] = useState();
  const [event, setEvent] = useState();
  const { id } = useParams(); // this id is of event
  const navigate = useNavigate();
  const [{ loading }, dispatch] = useReducer(reducer, {
    loading: false,
  });
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const {
    cart: { cartItems },
  } = state;
  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  cart.itemsPrice = 0;
  for (let i = 0; i < cartItems.length; i++) {
    cart.itemsPrice = round2(cartItems[i].price);
  }
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: "CREATE_REQUEST" });
      const date = localStorage.getItem("selectedDate"); // get date
      const time = localStorage.getItem("selectedTime"); // get time
      //  console.log(time);
      const client = JSON.parse(localStorage.getItem("userInfo"));
      const arrangements = JSON.parse(
        localStorage.getItem("itemsToAddWithQuantity")
      );
      localStorage.removeItem("itemsToAddWithQuantity");
      localStorage.removeItem("selectedDate");
      localStorage.removeItem("selectedTime");
      //console.log(arrangements, "These are arrangements testing");
      await Axios.put(`/api/events//addBookingDate//${id}`, {
        date: date,
        time: time,
      });

      let taxPrice = (event.price * 16) / 100;
      let totalPrice = event.price + taxPrice;
      let itemPrice = event.price;
      if (bid && bid.acceptedPrice) {
        taxPrice = (bid.acceptedPrice * 16) / 100;
        totalPrice = bid.acceptedPrice + taxPrice;
        itemPrice = bid.acceptedPrice;
      }
      const { data } = await Axios.post(
        "/api/orders",
        {
          orderItems: event,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: itemPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: taxPrice,
          totalPrice: totalPrice,
          bookingDate: date,
          vendorId: event.vendorId,
          clientId: client._id,
          specialArrangements: arrangements,
          arrangementsPrice: arrangementsPrice,
          time: time,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      if (bid) {
        const res = await Axios.delete(`/api/bid/${bid._id}`);
      }
      // localStorage.removeItem("arrangementsPrice");
      //ctxDispatch({ type: "CART_CLEAR" });
      ctxDispatch({ type: "CART_REMOVE_ITEM_ORDER", payload: id });
      dispatch({ type: "CREATE_SUCCESS" });
      localStorage.removeItem("cartItems");
      navigate(`/order/${id}/${data.order._id}`);
    } catch (err) {
      dispatch({ type: "CREATE_FAIL" });
      toast.error(getError(err));
    }
  };

  const getEventData = async () => {
    const { data } = await Axios.get(`/api/events/${id}`);
    setEvent(data);
  };
  useEffect(() => {
    getEventData();
  }, []);

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart, navigate]);

  const getBid = async () => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    console.log(user._id, id);
    const res = await Axios.get(
      `http://localhost:5000/api/bid/${id}/${user._id}`
    );
    console.log(res.data);
    if (res.data.message === "Bid not found") {
      setBid(0);
    } else {
      setBid(res.data);
    }
  };
  useEffect(() => {
    getBid();
  }, []);
  return (
    <div>
      <Helmet>
        <title>Confirm Details</title>
      </Helmet>
      <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>

      <h1 className="my-3">Confirm Details</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Booking</Card.Title>
              <Card.Text>
                <strong>Name</strong> {cart.shippingAddress.fullName} <br />
                {/* <strong>Address: </strong> {cart.shippingAddress.address},
                {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},
                {cart.shippingAddress.country} */}
              </Card.Text>
              <Link to="/shipping">Edit</Link>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method</strong> {cart.paymentMethod}
              </Card.Text>
              <Link to="/payment">Edit</Link>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Venues</Card.Title>
              {event && (
                <>
                  {/* {console.log(event)} */}
                  <ListGroup variant="flush">
                    <ListGroup.Item key={event._id}>
                      <Row className="align-items-center">
                        <Col md={6}>
                          <img
                            src={event.image}
                            alt={event.name}
                            className="img-fluid rounded img-thumbnail"
                          ></img>{" "}
                          <Link to={`/event/${event.slugs}`}>
                            {event.title}
                          </Link>
                        </Col>
                        <Col md={3}>
                          <span>{event.quantity}</span>
                        </Col>
                        <Col md={3}>PKR {event.price}/-</Col>
                      </Row>
                    </ListGroup.Item>
                  </ListGroup>
                  <Link to="/cart">Edit</Link>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                {event && (
                  <>
                    <ListGroup.Item>
                      <Row>
                        <Col>Events</Col>
                        {bid && bid.acceptedPrice ? (
                          <Col>PKR {bid.acceptedPrice}/-</Col>
                        ) : (
                          <Col>PKR {event.price}/-</Col>
                        )}
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Arrangements</Col>
                        <Col>PKR {arrangementsPrice}/-</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Tax</Col>
                        {bid && bid.acceptedPrice ? (
                          <Col>PKR {(bid.acceptedPrice * 16) / 100}/-</Col>
                        ) : (
                          <Col>PKR {(event.price * 16) / 100}/-</Col>
                        )}
                      </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <Row>
                        <Col>
                          <strong> Order Total</strong>
                        </Col>
                        {bid && bid.acceptedPrice ? (
                          <Col>
                            <strong>
                              PKR{" "}
                              {bid.acceptedPrice +
                                parseInt(arrangementsPrice) +
                                (bid.acceptedPrice * 16) / 100}
                              /-
                            </strong>
                          </Col>
                        ) : (
                          <Col>
                            <strong>
                              PKR{" "}
                              {event.price +
                                parseInt(arrangementsPrice) +
                                (event.price * 16) / 100}
                              /-
                            </strong>
                          </Col>
                        )}
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <div className="d-grid">
                        <Button
                          type="button"
                          onClick={placeOrderHandler}
                          disabled={cart.cartItems.length === 0}
                        >
                          Place Order
                        </Button>
                      </div>
                      {loading && <LoadingBox></LoadingBox>}
                    </ListGroup.Item>
                  </>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
