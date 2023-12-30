// HomeScreen.js
import { useEffect, useReducer } from "react";
import axios from "axios";
import logger from "use-reducer-logger";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Event from "../components/Event";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import Map from "../components/Maps";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import img10 from "../10.jpg";
import img7 from "../7.jpg";
import img8 from "../8.jpg";
import img9 from "../9.jpg";
import { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/esm/Modal";
import { Form, ButtonGroup, Container } from "react-bootstrap";

// ...
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, events: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  // ... (rest of the code)
  const [{ loading, error, events }, dispatch] = useReducer(logger(reducer), {
    events: [],
    loading: true,
    error: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get("/api/events");
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
    };
    fetchData();
  }, []);

  // Working for Google maps
  const [showMap, setShowMap] = useState(false);
  const [location, setLocation] = useState(null);
  const [confirmLocation, setConfirmLocation] = useState(false);
  const [isLocationSelected, setIsLocationSelected] = useState(false);
  const [locationEvents, setLocationEvents] = useState([]);
  const handleShowMap = () => {
    setShowMap(!showMap);
    if (!showMap) {
      setLocation(null);
    }
  };
  const handleConfirmLocation = async () => {
    setShowMap(false);
    setConfirmLocation(true);
    // implement api call
    // console.log("location tessss", location);
    setLocationEvents([]);
    const response = await axios.get(
      `http://localhost:5000/api/events/near/t/${location.lng}/${location.lat}/${miles}`
    );
    console.log(response.data, "response");
    setLocationEvents(response.data);
    handleLocationSelect();
  };

  const handleLocationSelect = (location) => {
    setIsLocationSelected(true);
  };
  const handleCancelFilter = () => {
    setIsLocationSelected(false);
  };

  // function to store the miles
  const [miles, setMiles] = useState(10);

  const handleMilesChange = (event) => {
    setMiles(event.target.value);
  };
  return (
    <div className="homeScreenWrapper ">
      <Helmet>
        <title>Event Organization System</title>
      </Helmet>
      <div>
        <Modal show={showMap} onHide={handleShowMap} centered>
          <Modal.Header closeButton>
            <Modal.Title>Map</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Map
              location={location}
              setLocation={setLocation}
              handleConfirmLocation={handleConfirmLocation}
            />
          </Modal.Body>
        </Modal>

        {/* {console.log(location)}{" "} */}
      </div>
      <Carousel
        autoPlay
        infiniteLoop
        showStatus={false}
        showThumbs={false}
        showIndicators={false}
        interval={2000}
        transitionTime={800}
        style={{ height: "200px" }}
      >
        <div>
          <img
            src={img7}
            alt="Description of image 1"
            style={{ objectFit: "cover", height: "50%" }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "0",
              marginBottom: "15px",
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              fontSize: "25px",
              width: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              textAlign: "center",
              padding: "10px",
            }}
          >
            <p>Welcome to Event Organization System</p>
          </div>
        </div>
        <div>
          <img
            src={img8}
            alt="Description of image 2"
            style={{ objectFit: "cover", height: "20%" }}
          />
        </div>
        <div>
          <img src={img9} alt="Description of image 3" />
        </div>
        <div>
          <img src={img10} alt="Description of image 3" />
        </div>
      </Carousel>
      <div className="mt-4 border rounded border-dark m-4 p-3">
        <h1 className="homeScreen">Featured Venues</h1>

        <div className="mt-4 border rounded">
          <Row className="align-items-center">
            <Col xs={12} md={1} className="mb-3 mb-md-0 text-end">
              <Form.Label> Miles:</Form.Label>
            </Col>
            <Col xs={12} md={1} className="mb-3 mb-md-0">
              <Form.Control
                type="number"
                placeholder="Enter miles"
                value={miles}
                onChange={handleMilesChange}
              />
            </Col>
            <Col xs={12} md={6} className="mt-3 mt-md-0">
              <ButtonGroup className="w-100">
                <Button
                  variant="outline-primary"
                  className="w-50 me-2"
                  onClick={handleShowMap}
                  style={{
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "1px solid #007bff",
                    borderRadius: "5px",
                    padding: "0.5rem 1rem",
                    fontSize: "1rem",
                    fontWeight: "400",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  Set Location
                </Button>
                <Button
                  variant="outline-danger"
                  className="w-50"
                  onClick={handleCancelFilter}
                >
                  Remove Filter
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
        </div>

        {!isLocationSelected && (
          <Container className="mt-4 p-4 border rounded">
            {loading ? (
              <LoadingBox />
            ) : error ? (
              <MessageBox variant="danger">{error}</MessageBox>
            ) : (
              <div>
                <Row className="justify-content-center">
                  {events.map((event) => (
                    <Col
                      key={event.slugs}
                      sm={6}
                      md={4}
                      lg={3}
                      className="mb-3"
                    >
                      <Event event={event}></Event>
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </Container>
        )}
        {isLocationSelected && (
          <Container className="mt-4 p-4 border rounded">
            {loading ? (
              <LoadingBox />
            ) : error ? (
              <MessageBox variant="danger">{error}</MessageBox>
            ) : (
              <div>
                {locationEvents.length > 0 ? (
                  <Row className="justify-content-center">
                    {locationEvents.map((event) => (
                      <Col
                        key={event.slugs}
                        sm={6}
                        md={4}
                        lg={3}
                        className="mb-3"
                      >
                        <Event event={event}></Event>
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <MessageBox variant="danger">No Events Found</MessageBox>
                )}
              </div>
            )}
          </Container>
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
