import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { Link, useNavigate, useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import socket from "../components/Socket";
import axios from "axios";
const BiddingScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // this id is of event
  const [vendorId, setVendorId] = useState("");
  const [bidStatus, setBidStatus] = useState(" ");
  const [VendorBid, setVendorBid] = useState(0);
  const [newBid, setNewBid] = useState("");
  const [clientBid, setClientBid] = useState(0);
  const [bidId, setBidId] = useState("");
  const [acceptedPrice, setAcceptedPrice] = useState(0);
  const [bidExist, setBidExist] = useState(false);
  const [event, setEvent] = useState();
  const handleAcceptBid = async () => {
    setBidStatus("accepted");
    const res = await axios.put(`/api/bid/${bidId}`, {
      bidStatus: "accepted",
      acceptedPrice: VendorBid,
    });
    console.log(res.data);
  };

  const handleRejectBid = async () => {
    setBidStatus("rejected");
    const res = await axios.put(`/api/bid/${bidId}`, {
      bidStatus: "rejected",
    });
    console.log(res.data);
  };

  const handlePlaceBid = async () => {
    if (!bidExist) {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      console.log("e", id, "u", user._id, "vId", vendorId, "b", newBid);
      const bidResponse = await axios.post("/api/bid", {
        event_id: id,
        user_id: user._id,
        vendor_id: vendorId,
        VendorBid: 0,
        UserBid: newBid,
        bidStatus: "ongoing",
      });

      // console.log(bidResponse.data.bid);
      setVendorBid(bidResponse.data.bid.VendorBid);
      setBidStatus(bidResponse.data.bid.bidStatus);
      setClientBid(bidResponse.data.bid.UserBid);
      setBidId(bidResponse.data.bid._id);
      setBidExist(true);
    } else {
      setClientBid(newBid);
      const res = await axios.put(`/api/bid/${bidId}`, {
        UserBid: newBid,
      });
      setBidStatus("ongoing");
    }
  };

  const hadleBooking = () => {
    if (acceptedPrice === 0) {
      localStorage.setItem("acceptedPrice", VendorBid);
    } else {
      localStorage.setItem("acceptedPrice", acceptedPrice);
    }

    navigate(`/signin?redirect=/${id}/shipping`);
  };
  const getBid = async () => {
    const response = await axios.get(`/api/events/${id}`);
    setEvent(response.data);
    // console.log(response.data);
    const vendorId = response.data.vendorId; // getting the vendor id

    const user = JSON.parse(localStorage.getItem("userInfo"));
    const res = await axios.get(`/api/bid/${id}/${user._id}`);
    //console.log(res.data, id, user._id);
    console.log("whattt");

    if (res.data.message === "Bid not found") {
      // console.log(bidResponse.data.bid);
      setVendorBid(0);
      setBidStatus("ongoing");
      setClientBid(0);
      setVendorId(vendorId);
    } else {
      setVendorBid(res.data.VendorBid);
      setBidStatus(res.data.bidStatus);
      setClientBid(res.data.UserBid);
      setBidId(res.data._id);
      setAcceptedPrice(res.data.acceptedPrice);
      setBidExist(true);
    }
  };
  useEffect(() => {
    getBid();
    console.log(`Sending bid update request for bid ID ${bidId}`);
    // Join the bid room
    if (bidId) {
      socket.emit("bidUpdate", bidId);
    }

    // Listen for updates
    socket.on("updateBid", (updatedBid) => {
      console.log("client side socket working");
      setVendorBid(updatedBid.VendorBid);
      setBidStatus(updatedBid.bidStatus);
      setClientBid(updatedBid.UserBid);
      setBidId(updatedBid._id);
      setAcceptedPrice(updatedBid.acceptedPrice);
    });

    return () => {
      // Cleanup
      socket.off("updateBid");
    };
  }, [localStorage.getItem("CountForBid"), bidId]);

  const renderBidStatus = () => {
    switch (bidStatus) {
      case "accepted":
        return (
          <>
            <CheckCircleOutlineIcon color="success" />
            <Typography variant="h6">Accepted</Typography>
          </>
        );
      case "rejected":
        return (
          <>
            <HighlightOffIcon color="error" />
            <Typography variant="h6">Rejected</Typography>
          </>
        );
      default:
        return (
          <>
            <HourglassEmptyIcon color="action" />
            <Typography variant="h6">Ongoing</Typography>
          </>
        );
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
        {renderBidStatus()}
      </Box>
      {bidStatus === "ongoing" && (
        <>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="flex-start"
          >
            <Grid item xs={6}>
              <Typography variant="h6">
                <span style={{ fontWeight: "bold" }}>Event Name:</span>{" "}
                {event.title}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6">
                <span style={{ fontWeight: "bold" }}>Original Price:</span>{" "}
                {event.price}
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="flex-start"
            mt={8}
          >
            <Grid item xs={6}>
              {VendorBid == 0 ? (
                <Typography variant="h6">
                  <span style={{ fontWeight: "bold" }}>
                    Current Vendor Bid:
                  </span>{" "}
                  PKR: -
                </Typography>
              ) : (
                <Typography variant="h6">
                  <span style={{ fontWeight: "bold" }}>
                    Current Vendor Bid:
                  </span>{" "}
                  {VendorBid} PKR
                </Typography>
              )}
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6">
                <span style={{ fontWeight: "bold" }}>Current Client Bid:</span>{" "}
                {clientBid} PKR
              </Typography>
            </Grid>
          </Grid>

          <Box my={2}>
            <TextField
              label="Place your bid"
              type="number"
              value={newBid}
              onChange={(e) => setNewBid(e.target.value)}
              fullWidth
              inputProps={{ min: 0 }}
            />
          </Box>

          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="flex-start"
          >
            <Grid item>
              <Box mb={2}>
                <Button variant="contained" onClick={handlePlaceBid}>
                  Place Bid
                </Button>
              </Box>
            </Grid>
            <Grid item>
              <Box mb={2}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleAcceptBid}
                  disabled={VendorBid === 0}
                >
                  Accept Bid
                </Button>
              </Box>
            </Grid>
            <Grid item>
              <Box mb={2}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleRejectBid}
                  disabled={VendorBid === 0}
                >
                  Reject Bid
                </Button>
              </Box>
            </Grid>
          </Grid>
        </>
      )}
      {bidStatus === "accepted" && (
        <>
          {acceptedPrice ? (
            <Box sx={{ backgroundColor: "#d4edda", p: 2, m: 2 }}>
              <Typography variant="h6" color="success">
                The bid is Successfully Placed, Negotiateg Price:{" "}
                {acceptedPrice} PKR
              </Typography>
            </Box>
          ) : (
            <Box sx={{ backgroundColor: "#d4edda", p: 2, m: 2 }}>
              <Typography variant="h6" color="success">
                The bid is Successfully Placed, Negotiateg Price: {VendorBid}{" "}
                PKR
              </Typography>
            </Box>
          )}

          <Box sx={{ display: "flex", justifyContent: "center" }} mb={2}>
            <Button variant="contained" color="success" onClick={hadleBooking}>
              Proceed to Booking
            </Button>
          </Box>
        </>
      )}
      {bidStatus === "rejected" && (
        <Box sx={{ backgroundColor: "#ffe4e4", p: 2 }}>
          <Typography variant="h6" color="error">
            Your bid was rejected by the vendor
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default BiddingScreen;
