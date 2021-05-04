/*
 *
 * Products
 *
 */

import React, { memo, useState } from "react";
import moment from "moment";
import DateMomentUtils from "@date-io/moment"; // choose your lib
import {
  Divider,
  Typography,
  Grid,
  Box,
  TextField,
  Button
} from "@material-ui/core";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
// import PropTypes from 'prop-types';
import pluginId from "../../pluginId";

const handleExportCSV = async payload => {
  try {
    let res = await fetch("/export-collections/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    window.location.href = "/" + data.file;
  } catch (err) {
    throw err;
  }
};

const Products = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(moment(new Date()));
  const [dateRangeError, setDateRangeError] = useState(false);

  const handleStartDateChange = value => {
    if (dateRangeError) {
      setDateRangeError(false);
    }
    setStartDate(value);
  };

  const handleEndDateChange = value => {
    if (dateRangeError) {
      setDateRangeError(false);
    }
    setEndDate(value);
  };

  const handleResetForm = () => {
    setStartDate(null);
    setEndDate(moment(new Date()));
    setStatus("");
  };

  const handleSubmit = () => {
    let start = 0,
      end = endDate.toDate().getTime();
    if (startDate) {
      start = startDate.toDate().getTime();
    }

    const range = end - start;

    if (range < 0) {
      setDateRangeError(true);
      return;
    }

    handleExportCSV({
      start,
      end
    });
  };

  return (
    <>
      <Typography variant="h3" component="h3">
        Products
      </Typography>

      <Box mt={2}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <MuiPickersUtilsProvider utils={DateMomentUtils}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <DatePicker
                    fullWidth
                    format="MM/DD/yyyy"
                    label="Start date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    error={dateRangeError}
                  />
                </Grid>
                <Grid item xs={6}>
                  <DatePicker
                    fullWidth
                    format="MM/DD/yyyy"
                    label="End date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    error={dateRangeError}
                  />
                </Grid>
              </Grid>
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
        {dateRangeError && (
          <Typography style={{ color: "red" }}>
            Invalid date range, end date must be higher than start date
          </Typography>
        )}
        <Box mt={2}>
          <Button variant="contained" size="large" onClick={handleResetForm}>
            Reset
          </Button>

          <Button
            color="primary"
            variant="contained"
            size="large"
            onClick={handleSubmit}
          >
            Export CSV
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default memo(Products);
