import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import axios from "axios";
import { useContext, useReducer } from "react";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { AiOutlinePlus } from "react-icons/ai";
import "./Event.css"; // Import the Event.css

// ... (rest of the code)
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_REQUEST":
      return { ...state, loading: true };
    case "ADD_SUCCESS":
      return {
        ...state,
        loading: false,
      };
    case "ADD_FAIL":
      return { ...state, loading: false };
    default:
      return state;
  }
};
function Product(props) {
  // ... (rest of the code)
  const [{ loading, error }, dispatch] = useReducer(reducer, {
    error: "",
    loading: true,
  });
  const { event } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const { userInfo } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === event._id);
    if (existItem) {
      toast.error("Sorry Event is already in the cart");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item },
    });
  };
  const addToFavouriteHandler = async (item) => {
    try {
      dispatch({ type: "ADD_REQUEST" });
      const { data } = await axios.post(
        `/api/users/${userInfo._id}/favorites`,
        { item },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      toast.success("Event added to your favourites");
      dispatch({ type: "ADD_SUCCESS" });
    } catch (err) {
      toast.error(err.response.data);
      dispatch({
        type: "ADD_FAIL",
      });
    }
  };
  return (
    <Card className="venueCard">
      <Link to={`/event/${event.slugs}`}>
        <img src={event.image} className="card-img-top" alt={event.title}></img>
      </Link>
      <Card.Body>
        <Link to={`/event/${event.slugs}`}>
          <Card.Title className="title">{event.title}</Card.Title>
        </Link>
        <Rating rating={event.rating} numReviews={event.numberOfReviews} />

        <Card.Text>PKR {event.price}/-</Card.Text>
        <div className="button-group">
          {event.suspended ? (
            <Button
              variant="light"
              disabled
              className="mx-2"
              style={{
                background: "linear-gradient(to right, #e53935, #d32f2f)",
              }}
            >
              Unavailable
            </Button>
          ) : (
            <Button onClick={() => addToCartHandler(event)} className="mx-2">
              Add to Cart
            </Button>
          )}
          <Button onClick={() => addToFavouriteHandler(event)}>
            <AiOutlinePlus /> Favourite
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
export default Product;
