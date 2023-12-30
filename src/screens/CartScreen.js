import { useContext, useState } from "react";
import { Store } from "../Store";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import MessageBox from "../components/MessageBox";
import { Link, useNavigate } from "react-router-dom";
import Calendar from "../components/Calendar";

export default function CartScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const [showCalendar, setShowCalendar] = useState(false);
  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };
  const removeItemHandler = (item) => {
    ctxDispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };
  const bookingHandler = async (id) => {
    console.log(id);
    navigate(`/signin?redirect=/${id}/shipping`);
  };
  const checkAvailability = () => {
    //navigate('/signin?redirect=/shipping');
  };
  const biddingHandler = async (id) => {
    console.log(id);
    navigate(`/signin?redirect=/${id}/bidding`);
  };
  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1>Event Cart</h1>
      <Row>
        <Col md={12}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is empty. <Link to="/">Go Shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  {console.log(item)}
                  <Row className="align-items-center">
                    <Col md={5}>
                      <img
                        src={item.image}
                        alt={item.title}
                        className="img-fluid rounded img-thumbnail"
                      ></img>{" "}
                      <Link to={`/event/${item.slugs}`} className="link">
                        {item.title}
                      </Link>
                    </Col>
                    <Col md={1}>Price: PKR {item.price}/-</Col>
                    <Col md={1}>
                      <Button
                        onClick={() => removeItemHandler(item)}
                        variant="light"
                        className="link"
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>

                    <Col md={2}>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => biddingHandler(item._id)}
                        disabled={cartItems.suspended}
                      >
                        Bid Event
                      </Button>
                    </Col>
                    <Col md={1}>
                      {/* <Button
                        type="button"
                        variant="primary"
                        onClick={bookingHandler}
                        disabled={cartItems.length === 0}
                      >
                        Proceed to Booking
                      </Button> */}
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => bookingHandler(item._id)}
                        disabled={cartItems.suspended}
                      >
                        Book
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
      </Row>
    </div>
  );
}
