import { useContext, useEffect, useReducer } from "react";
import { Store } from "../Store";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import MessageBox from "../components/MessageBox";
import { Link, useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";
import logger from "use-reducer-logger";
import axios from "axios";
import { toast } from "react-toastify";
import { getError } from "../utils";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, events: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false, successDelete: false };

    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

export default function FavouriteListScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    favourites: { favouritesItems },
  } = state;
  const { userInfo } = state;
  const [{ events, loading, error, loadingDelete, successDelete }, dispatch] =
    useReducer(logger(reducer), {
      events: [],
      loading: true,
      error: "",
    });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        console.log("api call");
        const result = await axios.get(`/api/users/${userInfo._id}/favorites`);
        console.log(result.data);
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
        //toast.error(getError(error));
      }

      //setEvents(result.data);
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [userInfo, successDelete]);

  const removeItemHandler = async (item) => {
    //ctxDispatch({ type: "FAVOURITES_REMOVE_ITEM", payload: item });
    dispatch({ type: "DELETE_REQUEST" });
    try {
      console.log("Showing the Item", item);
      await axios.put(`/api/users/${userInfo._id}/favorites`, { item });
      dispatch({ type: "DELETE_SUCCESS" });
      toast.success("Event removed from favourites");
    } catch (err) {
      dispatch({ type: "DELETE_FAIL" });
      toast.error(getError(err));
    }
  };
  return (
    <div>
      <Helmet>
        <title>Favourite List</title>
      </Helmet>
      <h1>Favourite List</h1>
      <Row>
        {events.length === 0 ? (
          <MessageBox>
            Favorite List is empty.{" "}
            <Link to="/">Go Look for Events to Add in Your Favourites.</Link>
          </MessageBox>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th className="text-center">Image</th>
                <th className="text-center">Title</th>
                <th className="text-center">Price</th>
                <th className="text-center">Category</th>
                <th className="text-center">Author</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {events.map((item) => (
                <tr key={item._id}>
                  <td className="text-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="img-fluid rounded img-thumbnail"
                    />
                  </td>
                  <td className="text-center">
                    <Link to={`/event/${item.slugs}`}>{item.title}</Link>
                  </td>
                  <td className="text-center">PKR {item.price}/-</td>
                  <td className="text-center">{item.category}</td>
                  <td className="text-center">{item.author}</td>
                  <td className="text-center">
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => removeItemHandler(item)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Row>
    </div>
  );
}
