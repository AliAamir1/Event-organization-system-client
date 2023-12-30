import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Calendar.css"; // import custom CSS for red highlighted dates
import axios from "axios";
import { useCallback } from "react";

const ThreeMonthDatePicker = (props) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [bookings, setBookings] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]); // these are the ones to show on the front end
  const [allTimeSlots, setAllTimeSlots] = useState([]); // these are all the time slots for the day

  const [Event, setEvent] = useState({}); // this is the event object from the database
  const minDate = new Date(); // Today's date
  // const maxDate = new Date();
  // maxDate.setMonth(maxDate.getMonth() + 3); // Three months from now
  // const maxDate = new Date();
  // // maxDate.setDate(maxDate.getDate() + 24);
  const [maxDate, setMaxDate] = useState();
  const [offDays, setOffDays] = useState([]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    let itemsToRemove;
    for (let i in bookings) {
      if (
        bookings[i].date.getFullYear() === date.getFullYear() &&
        bookings[i].date.getMonth() === date.getMonth() &&
        bookings[i].date.getDate() === date.getDate()
      ) {
        // console.log(bookings[i].time, "great");
        itemsToRemove = bookings[i].time;
      }
    }
    console.log(date);
    //console.log(itemsToRemove, "yoooooooo", date, bookings);
    if (itemsToRemove) {
      removeTimeSlots(itemsToRemove);
    } else {
      setTimeSlots(allTimeSlots);
    }

    setSelectedOption("");
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();

    const formattedDate = `${day}/${month}/${year}`;
    localStorage.setItem("selectedDate", formattedDate);
  };

  const handleOptionChange = (event) => {
    const timeRange = event.target.value;
    const firstPart = timeRange.substring(0, timeRange.indexOf(" - "));
    setSelectedOption(timeRange);

    localStorage.setItem("selectedTime", firstPart);
  };

  const [disableDates, setDisableDates] = useState([]);

  function removeTimeSlots(toRemoveTimes) {
    const filteredTimeSlots = allTimeSlots.filter(
      (time) => !toRemoveTimes.includes(time)
    );

    setTimeSlots(filteredTimeSlots);
  }

  function calculateTimeSlots(opening, closing, duration) {
    const gettimeSlots = [];
    const startTime = new Date(`2000-01-01T${opening}:00`);
    const endTime = new Date(`2000-01-01T${closing}:00`);

    const timeDiff = endTime.getTime() - startTime.getTime();
    const slotDiff = duration * 60 * 1000;
    let currentTime = startTime;
    while (currentTime <= endTime - slotDiff) {
      gettimeSlots.push(
        new Date(currentTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      currentTime = new Date(currentTime.getTime() + slotDiff);
    }

    // setTimeSlots(gettimeSlots);
    setAllTimeSlots(gettimeSlots);
    return gettimeSlots.length;
  }

  useEffect(() => {
    const fetchDates = async () => {
      const res = await axios.get(
        `http://localhost:5000/api/events/${props.eventId}`
      );
      const event = res.data;
      console.log(event, "yyyyyyyyyyyyyy");
      if (offDays.length === 0) {
        // Convert days to corresponding numbers
        const dayNumbers = event.offDays.map((day) => {
          switch (day) {
            case "Sunday":
              return 0;
            case "Monday":
              return 1;
            case "Tuesday":
              return 2;
            case "Wednesday":
              return 3;
            case "Thursday":
              return 4;
            case "Friday":
              return 5;
            case "Saturday":
              return 6;
            default:
              return -1; // Invalid day name
          }
        });

        setOffDays(dayNumbers);
        console.log(dayNumbers, "offDays");
      }

      if (!maxDate) {
        if (event.advanceBookingDuration) {
          console.log("going in");
          const temp = new Date(Date.now());
          temp.setDate(temp.getDate() + event.advanceBookingDuration);
          console.log(temp);
          setMaxDate(temp);
        } else {
          const temp = new Date(Date.now());
          temp.setDate(temp.getDate() + 30);

          setMaxDate(temp);
        } // setting max date for bookings
      }
      const getbookings = event.bookings.map((date) => {
        const [day, month, year] = date.date.split("/");
        const dateObject = new Date(year, month - 1, day);
        return { date: dateObject, time: date.time };
      });
      dayClassName(getbookings);
      const maxBookingsInaDay = await calculateTimeSlots(
        event.opening,
        event.closing,
        event.stock
      );

      setBookings(getbookings);
      setEvent(event);

      for (let i in getbookings) {
        if (getbookings[i].time.length >= maxBookingsInaDay) {
          setDisableDates((prevDisableDates) => [
            ...prevDisableDates,
            getbookings[i].date,
          ]);
        }
      }
    };
    fetchDates();
  }, [props.eventId]);

  const dayClassName = (date) => {
    if (
      disableDates.some(
        (disabledDate) =>
          (disabledDate.getDate() === date.getDate()) &
          (disabledDate.getMonth() === date.getMonth()) &
          (disabledDate.getFullYear() === date.getFullYear())
      )
    ) {
      return "disabled alternate-date";
    } else {
      return null;
    }
  };

  // function to disables the off days
  const isDayDisabled = (date) => {
    const dayOfWeek = date.getDay();
    return !offDays.includes(dayOfWeek);
  };

  return (
    <div>
      <DatePicker
        placeholderText="Select a date"
        selected={selectedDate}
        onChange={handleDateChange}
        minDate={minDate}
        maxDate={maxDate}
        dateFormat="dd/MM/yyyy"
        dayClassName={dayClassName}
        filterDate={isDayDisabled}
        style={{ width: "1000px", height: "1000px" }}
      />
      {selectedDate && (
        <select value={selectedOption} onChange={handleOptionChange}>
          <option value="" disabled hidden>
            Select the time
          </option>
          {timeSlots &&
            timeSlots.map((time, index) => {
              const date = new Date(`01/01/2000 ${time}`);
              date.setMinutes(date.getMinutes() + Event.stock);
              return (
                <option>
                  {time} -{" "}
                  {date.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </option>
              );
            })}
          {console.log(timeSlots)}
        </select>
      )}
    </div>
  );
};

export default ThreeMonthDatePicker;
