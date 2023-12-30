import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Container,
  Grid,
} from "@mui/material";
import axios from "axios";
import EventDetail from "../components/EventDetail";

const useStyles = makeStyles({
  root: {
    marginTop: 2,
  },
  container: {
    paddingTop: 4,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#424242",
    textAlign: "center",
  },

  heading1: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#424242",
    paddingTop: 10,
  },
  details: {
    marginBottom: 30,
    fontWeight: "bold",
  },
  card: {
    margin: 10,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    borderRadius: 4,
    transition: "0.3s",
    "&:hover": {
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
    },
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9 aspect ratio
  },
  content: {
    padding: 16,
  },
  eventName: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 8,
  },
  eventDescription: {
    color: "#616161",
  },
});

const VendorDetails = () => {
  const classes = useStyles();
  const { vendorID } = useParams();
  const [vendor, setVendor] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`/api/vendor/${vendorID}`);
      console.log(res.data, "for vendorID");
      setVendor(res.data);
      const eventPromises = res.data.event_id.map((eventId) =>
        axios.get(`/api/events/${eventId}`)
      );
      const eventsRes = await Promise.all(eventPromises);
      console.log(eventsRes);
      setEvents(eventsRes.map((event) => event.data));
    };
    fetchData();
  }, [vendorID]);

  if (!vendor) {
    return <div>Loading...</div>;
  }

  return (
    <div className={classes.root}>
      <Container maxWidth="md" className={classes.container}>
        <Typography className={classes.heading} variant="h2">
          Vendor Details
        </Typography>
        <Grid container spacing={4} className={classes.details}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h4" style={{ paddingTop: 10 }}>
              {vendor.name}
            </Typography>
            <Typography variant="body1">Email: {vendor.email}</Typography>
            <Typography variant="body1">CNIC: {vendor.CNIC}</Typography>
            <Typography variant="body1">Phone: {vendor.phone}</Typography>
            <Typography variant="body1">Address: {vendor.address}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography className={classes.heading1} variant="h4">
              Business Details
            </Typography>
            <Typography variant="body1">
              Business Name: {vendor.businessName}
            </Typography>
            <Typography variant="body1">
              Bank Account Name: {vendor.bankName}
            </Typography>
            <Typography variant="body1">
              Bank Account Number: {vendor.accountNumber}
            </Typography>
          </Grid>
        </Grid>
        <Typography className={classes.heading} variant="h4">
          Events
        </Typography>
        <Grid container spacing={4}>
          {events.map((event) => (
            <Grid item key={event._id} xs={12} sm={6} md={4}>
              <EventDetail event={event}></EventDetail>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default VendorDetails;
