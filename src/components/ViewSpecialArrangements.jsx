import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";

const ViewSpecialArrangements = ({ eventId, handleCloseModal }) => {
  //const [totalPrice, setTotalPrice] = useState(0);
  const [arrangements, setArrangements] = useState([]);
  const [selectedArrangements, setSelectedArrangements] = useState({});
  const [quantities, setQuantities] = useState({});
  const [maxIndex, setMaxIndex] = useState(0); // stores index of arragnment with max length
  useEffect(() => {
    const getSpecialArrangements = async () => {
      const res = await axios.get(
        `http://localhost:5000/api/events/getSpecialArrangements/${eventId}`
      );
      console.log(res.data.arrangements, "These are the arrangements returned");
      setArrangements(res.data.arrangements);
      const largestIndex = res.data.arrangements.reduce((acc, cur, i) => {
        if (cur.length > res.data.arrangements[acc].length) {
          return i;
        } else {
          return acc;
        }
      }, 0);
      console.log(largestIndex, "largest", res.data.arrangements);
      setMaxIndex(largestIndex);
    };
    getSpecialArrangements();
  }, [eventId]);

  const handleCheckboxChange = (event, arrangementId) => {
    setSelectedArrangements({
      ...selectedArrangements,
      [arrangementId]: event.target.checked,
    });
  };

  const handleQuantityChange = (event, arrangementId) => {
    setQuantities({
      ...quantities,
      [arrangementId]: event.target.value,
    });
  };

  const handleAddToCart = async () => {
    const itemsToAddWithQuantity = arrangements.map((arrangement, index) => ({
      ...arrangement,
      quantity: quantities[index] || 0,
    }));
    // console.log(itemsToAddWithQuantity, "items to add");

    // send data to server to add to cart or do other processing

    let totalPrice = 0;
    for (let i in itemsToAddWithQuantity) {
      totalPrice =
        totalPrice +
        parseInt(itemsToAddWithQuantity[i][2]) *
          parseInt(itemsToAddWithQuantity[i].quantity);
    }
    console.log(totalPrice);
    console.log(itemsToAddWithQuantity);
    localStorage.setItem("arrangementsPrice", totalPrice);
    localStorage.setItem(
      "itemsToAddWithQuantity",
      JSON.stringify(itemsToAddWithQuantity)
    );
    handleCloseModal();
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="special arrangements table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="center">Quantity</TableCell>
            <TableCell align="center">Price</TableCell>
            {console.log(maxIndex, "maxIndex")}
            {arrangements && maxIndex && arrangements[maxIndex].length > 3 ? (
              Object.keys(arrangements[maxIndex])
                .slice(3) // skip first 3 columns (name, quantity, price)
                .map((column) => (
                  <TableCell key={column} align="center">
                    Additional Detail
                  </TableCell>
                ))
            ) : (
              <></>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {arrangements.map((arrangement, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {arrangement[0]}
              </TableCell>
              <TableCell component="th" scope="row" align="center">
                {arrangement[1]}
              </TableCell>
              <TableCell component="th" scope="row" align="center">
                {arrangement[2]}
              </TableCell>

              {arrangement.length !== 0 && (
                <>
                  {Object.keys(arrangement)
                    .slice(3) // skip first 3 columns (name, quantity, price)
                    .map((column) => (
                      <TableCell key={column} align="center">
                        {arrangement[column]}
                      </TableCell>
                    ))}
                  {Object.keys(arrangements[maxIndex])
                    .slice(arrangement.length) // skip first 3 columns (name, quantity, price)
                    .map((column) => (
                      <TableCell key={column} align="center">
                        -
                      </TableCell>
                    ))}
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ViewSpecialArrangements;
