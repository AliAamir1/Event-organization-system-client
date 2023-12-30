import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import "./Event.css"; // Import the Event.css

// ... (rest of the code)

function EventDetail(props) {
  // ... (rest of the code)

  const { event } = props;

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
      </Card.Body>
    </Card>
  );
}
export default EventDetail;
