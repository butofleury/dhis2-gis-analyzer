import React, { Component } from "react";
import NavigationBar from "./NavigationBar";
import GISTable from "./GISTable";
import Grid from "material-ui/Grid";
import { BrowserRouter as Router, Route } from "react-router-dom";

class App extends Component {
  render() {
    console.log(process.env.REACT_APP_DHIS2_URL);
    console.log(process.env.REACT_APP_BASIC_AUTH);
    console.log(process.env);
    return (
      <Router>
        <div>
          <NavigationBar />
          <Grid container spacing={24} style={{ height: "100%" }}>
            <Grid item xs={12} style={{ height: "100%", padding: "30px" }}>
              <Route exact path="/" component={GISTable} />
            </Grid>
          </Grid>
        </div>
      </Router>
    );
  }
}

export default App;
