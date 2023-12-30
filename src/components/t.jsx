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

  return (
    <Box className="homeScreenWrapper">
      <Helmet>
        <title>Event Organization System</title>
      </Helmet>
      <div>
        <Dialog open={showMap} onClose={handleShowMap}>
          <DialogTitle>
            Map
            <Button onClick={handleShowMap} color="inherit" size="small">
              X
            </Button>
          </DialogTitle>
          <DialogContent>
            <Map
              location={location}
              setLocation={setLocation}
              handleConfirmLocation={handleConfirmLocation}
            />
          </DialogContent>
        </Dialog>
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
        {/* ... */}
      </Carousel>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Featured Venues
      </Typography>
      <Button onClick={handleShowMap} variant="contained" color="primary">
        Toggle Map
      </Button>
      <Button
        onClick={handleLocationSelect}
        variant="contained"
        color="secondary"
      >
        Cancel Location Filter
      </Button>
      {!isLocationSelected && (
        <div className="events">
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <Grid container spacing={3}>
              {events.map((event) => (
                <Grid item key={event.slugs} xs={12} sm={6} md={4} lg={3}>
                  <Event event={event}></Event>
                </Grid>
              ))}
            </Grid>
          )}
        </div>
      )}
      {isLocationSelected && (
        <div className="events">
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <Grid container spacing={3}>
              {locationEvents.map((event) => (
                <Grid item key={event.slugs} xs={12} sm={6} md={4} lg={3}>
                  <Event event={event}></Event>
                </Grid>
              ))}
            </Grid>
          )}
        </div>
      )}
    </Box>
  );
}

export default HomeScreen;
