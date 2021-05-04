/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from "react";
import { Switch, Route, Link } from "react-router-dom";
import { NotFound } from "strapi-helper-plugin";
import "@fontsource/roboto";

import {
  Card,
  CardContent,
  List,
  ListItem,
  Divider,
  Typography,
  Box,
  Grid
} from "@material-ui/core";

// Utils
import pluginId from "../../pluginId";
// Boxs
import HomePage from "../HomePage";
import Orders from "../Orders";
import Products from "../Products";

const App = () => {
  return (
    <Box p={4} fontSize={16}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h4" component="h4">
                Collections
              </Typography>
              <List component="nav">
                <ListItem
                  button
                  component={Link}
                  to={`/plugins/${pluginId}/orders`}
                >
                  <Typography variant="h5">• Orders</Typography>
                </ListItem>
                <Divider />
                <ListItem
                  button
                  component={Link}
                  to={`/plugins/${pluginId}/products`}
                >
                  <Typography variant="h5">• Products</Typography>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={8}>
          <Switch>
            <Route path={`/plugins/${pluginId}`} component={HomePage} exact />
            <Route
              path={`/plugins/${pluginId}/orders`}
              component={Orders}
              exact
            />
            <Route
              path={`/plugins/${pluginId}/products`}
              component={Products}
              exact
            />
            <Route component={NotFound} />
          </Switch>
        </Grid>
      </Grid>
    </Box>
  );
};

export default App;
