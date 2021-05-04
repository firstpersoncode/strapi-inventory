/*
 *
 * HomePage
 *
 */

import React, { memo } from "react";
import { Divider, Typography } from "@material-ui/core";
// import PropTypes from 'prop-types';
import pluginId from "../../pluginId";

const HomePage = () => {
  return (
    <>
      <Typography variant="h2" component="h1">
        {pluginId}
      </Typography>
      <Divider />
      <Typography component="p">Export data to CSV / PDF format</Typography>
    </>
  );
};

export default memo(HomePage);
