// SearchScreen.js
import React, { useEffect, useReducer, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { getError } from "../utils";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Rating from "../components/Rating";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Button from "react-bootstrap/Button";
import Event from "../components/Event.js";
import LinkContainer from "react-router-bootstrap/LinkContainer";
import { Form, FormCheck, ListGroup } from "react-bootstrap";
import "./SearchScreen.css";

// ...
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        events: action.payload.events,
        page: action.payload.page,
        pages: action.payload.pages,
        countEvents: action.payload.countEvents,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const prices = [
  {
    name: "PKR:1 to PKR:1000",
    value: "1-1000",
  },
  {
    name: "PKR:1,000 to Pkr:5,000",
    value: "1000-5000",
  },
  {
    name: "PKR:10,000 to PKR1,00,000",
    value: "10000-100000",
  },
];

export const ratings = [
  {
    name: "4stars & up",
    rating: 4,
  },

  {
    name: "3stars & up",
    rating: 3,
  },

  {
    name: "2stars & up",
    rating: 2,
  },

  {
    name: "1stars & up",
    rating: 1,
  },
];
export default function SearchScreen() {
  // ...
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search); // /search?category=farmhouse
  const category = sp.get("category") || "all";
  const query = sp.get("query") || "all";
  const price = sp.get("price") || "all";
  const rating = sp.get("rating") || "all";
  const order = sp.get("order") || "newest";
  const page = sp.get("page") || 1;

  const [{ loading, error, events, pages, countEvents }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: "",
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/events/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [category, error, order, page, price, query, rating]);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/events/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, [dispatch]);

  const getFilterUrl = (filter, skipPathname) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const sortOrder = filter.order || order;
    return `${
      skipPathname ? "" : "/search?"
    }category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`;
  };
  return (
    <div className="searchScreenWrapper">
      <Helmet>
        <title>Search Event Venues</title>
      </Helmet>
      <Row>
        <Col md={3}>
          <div className="filterSection">
            <h3 className="filterTitle">Price</h3>
            {/* ... */}
            <FormCheck
              type="checkbox"
              checked={"all" === price}
              onChange={(e) =>
                navigate(getFilterUrl({ price: e.target.checked ? "all" : "" }))
              }
              label="Any"
            />

            {prices.map((p) => (
              <item key={p.value}>
                <FormCheck
                  type="checkbox"
                  checked={p.value === price}
                  onChange={(e) =>
                    navigate(
                      getFilterUrl({ price: e.target.checked ? p.value : "" })
                    )
                  }
                  label={p.name}
                />
              </item>
            ))}
          </div>
          <div className="filterSection">
            <h3 className="filterTitle">Avg. Customer Review</h3>
            {/* ... */}
            {ratings.map((r) => (
              <item key={r.name}>
                <Link
                  to={getFilterUrl({ rating: r.rating })}
                  className={`${r.rating}` === `${rating}` ? "text-bold" : ""}
                >
                  <Rating caption={" & up"} rating={r.rating}></Rating>
                </Link>
              </item>
            ))}
            <Link
              to={getFilterUrl({ rating: "all" })}
              className={rating === "all" ? "text-bold" : ""}
            >
              <Rating caption={" & up"} rating={0}></Rating>
            </Link>
          </div>
          <div className="filterSection">
            <h3 className="filterTitle">Department</h3>
            {/* ... */}
            <div>
              <FormCheck
                type="checkbox"
                checked={"all" === category}
                onChange={(e) =>
                  navigate(
                    getFilterUrl({ category: e.target.checked ? "all" : "" })
                  )
                }
                label="Any"
              />

              {categories.map((c) => (
                <item key={c}>
                  <FormCheck
                    type="checkbox"
                    checked={c === category}
                    onChange={(e) =>
                      navigate(
                        getFilterUrl({ category: e.target.checked ? c : "" })
                      )
                    }
                    label={c}
                  />
                </item>
              ))}
            </div>
          </div>
        </Col>
        <Col md={9}>
          {/* ... */}
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              <Row className="justify-content-between mb-3">
                <Col md={6}>
                  <div>
                    {countEvents === 0 ? "No" : countEvents} Results
                    {query !== "all" && " : " + query}
                    {category !== "all" && " : " + category}
                    {price !== "all" && " : Price " + price}
                    {rating !== "all" && " : Rating " + rating + " & up"}
                    {query !== "all" ||
                    category !== "all" ||
                    rating !== "all" ||
                    price !== "all" ? (
                      <Button
                        variant="light"
                        onClick={() => navigate("/search")}
                      >
                        <i className="fas fa-times-circle"></i>
                      </Button>
                    ) : null}
                  </div>
                </Col>
                <Col className="text-end">
                  Sort by{" "}
                  <select
                    value={order}
                    onChange={(e) => {
                      navigate(getFilterUrl({ order: e.target.value }));
                    }}
                  >
                    <option value="newest">Newest</option>
                    <option value="lowest">Price: Low to High</option>
                    <option value="highest">Price: High to Low</option>
                    <option value="toprated">Avg. Customer Reviews</option>
                  </select>
                </Col>
              </Row>
              {events.length === 0 && <MessageBox>No Venues Found</MessageBox>}

              <Row>
                {events.map((event) => (
                  <Col sm={6} lg={4} className="mb-3" key={event._id}>
                    <Event event={event}></Event>
                  </Col>
                ))}
              </Row>
              <div className="pagination">
                {/* ... */}

                <div>
                  {[...Array(pages).keys()].map((x) => (
                    <LinkContainer
                      key={x + 1}
                      className="mx-1"
                      to={{
                        pathname: "/search",
                        search: getFilterUrl({ page: x + 1 }, true),
                      }}
                    >
                      <Button
                        className={Number(page) === x + 1 ? "text-bold" : ""}
                        variant="light"
                      >
                        {x + 1}
                      </Button>
                    </LinkContainer>
                  ))}
                </div>
              </div>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
}
