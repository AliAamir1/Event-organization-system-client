import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Grid,
  makeStyles,
} from "@material-ui/core";
import axios from "axios";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
  },
  table: {
    borderCollapse: "collapse",
    border: "2px solid #ddd",
  },
  tableCell: {
    border: "2px solid #ddd",
    textAlign: "center",
  },
  button: {
    "&:hover": {
      textDecoration: "none",
    },
  },
  viewButton: {
    borderColor: "blue",
    color: "blue",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 255, 0.1)",
    },
  },
  acceptButton: {
    borderColor: "green",
    color: "green",
    "&:hover": {
      backgroundColor: "rgba(0, 128, 0, 0.1)",
    },
  },
  rejectButton: {
    borderColor: "red",
    color: "red",
    "&:hover": {
      backgroundColor: "rgba(255, 0, 0, 0.1)",
    },
  },
}));

const openInNewTab = (url) => {
  const newWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (newWindow) newWindow.opener = null;
};

function VendorRequestsScreen() {
  const classes = useStyles();
  const [vendors, setVendors] = useState([]);

  const fetchPendingVendors = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/vendor/pending/t"
      );
      setVendors(data);
    } catch (error) {
      console.error("Error fetching pending vendors:", error);
    }
  };

  useEffect(() => {
    fetchPendingVendors();
  }, []);
  const handleViewBusinessDetails = async (id) => {
    const url = await axios.get(`/api/vendor/${id}/url`);
    openInNewTab(url.data.url);
  };

  const handleAccept = async (id) => {
    const status = "accepted";
    const url = await axios.put(`/api/vendor/${id}/changestatus`, { status });
    toast.success("Vendor accepted successfully");
    fetchPendingVendors();
  };

  const handleReject = async (id) => {
    const status = "rejected";
    const url = await axios.put(`/api/vendor/${id}/changestatus`, { status });
    toast.success("Vendor rejected successfully");
    fetchPendingVendors();
  };

  return (
    <Container className={classes.container}>
      <Typography variant="h4" align="center" gutterBottom>
        Pending Vendor Requests
      </Typography>
      <TableContainer>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableCell}>Vendor Name</TableCell>
              <TableCell className={classes.tableCell}>Business Name</TableCell>
              <TableCell className={classes.tableCell}>Bank Name</TableCell>
              <TableCell className={classes.tableCell}>Account</TableCell>
              <TableCell className={classes.tableCell}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vendors.map((vendor) => (
              <TableRow key={vendor._id}>
                <TableCell className={classes.tableCell}>
                  {vendor.name}
                </TableCell>
                <TableCell className={classes.tableCell}>
                  {vendor.businessName}
                </TableCell>
                <TableCell className={classes.tableCell}>
                  {vendor.bankName}
                </TableCell>
                <TableCell className={classes.tableCell}>
                  {vendor.accountNumber}
                </TableCell>
                <TableCell className={classes.tableCell}>
                  <Grid container spacing={2}>
                    <Grid item>
                      <Button
                        variant="outlined"
                        onClick={() => handleViewBusinessDetails(vendor._id)}
                        className={`${classes.button} ${classes.viewButton}`}
                      >
                        View Business Details
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        onClick={() => handleAccept(vendor._id)}
                        className={`${classes.button} ${classes.acceptButton}`}
                      >
                        Accept
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        onClick={() => handleReject(vendor._id)}
                        className={`${classes.button} ${classes.rejectButton}`}
                      >
                        Reject
                      </Button>
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default VendorRequestsScreen;
