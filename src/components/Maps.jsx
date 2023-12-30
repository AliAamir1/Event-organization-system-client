import React, { useState, useCallback, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { TextField, Button, Grid, Container, Typography } from "@mui/material";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 31.5204,
  lng: 74.3587,
};

const Map = ({ location, setLocation, handleConfirmLocation }) => {
  const [address, setAddress] = useState("");

  const handleAddressChange = useCallback((event) => {
    setAddress(event.target.value);
  }, []);

  const handleGeocode = useCallback(() => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK") {
        setLocation({
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        });
      } else {
        console.log(
          "Geocode was not successful for the following reason: " + status
        );
      }
    });
  }, [address, setLocation]);

  const ConfirmLocation = () => {
    handleConfirmLocation();
  };
  const [isAPILoaded, setAPILoaded] = useState(false);

  useEffect(() => {
    if (window.google && window.google.maps) {
      setAPILoaded(true);
    }
  }, []);

  return (
    <div>
      <Container sx={{ border: "1px solid black", padding: "1rem" }}>
        {isAPILoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={location || defaultCenter}
            zoom={10}
            onClick={(e) => {
              setLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
            }}
          >
            {location && (
              <Marker
                key={`${location.lat}-${location.lng}`}
                position={location}
              />
            )}

            {console.log("seeting location", location)}
          </GoogleMap>
        ) : (
          <Typography variant="h5" align="center">
            Loading Google Maps...
          </Typography>
        )}

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              label="Address"
              variant="outlined"
              fullWidth
              value={address}
              onChange={handleAddressChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              size="small"
              fullWidth
              onClick={handleGeocode}
              sx={{ height: "100%" }}
            >
              Pin Location
            </Button>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              fullWidth
              size="small"
              onClick={ConfirmLocation}
              sx={{ height: "100%" }}
              disabled={!location}
            >
              Confirm
            </Button>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default React.memo(Map);
