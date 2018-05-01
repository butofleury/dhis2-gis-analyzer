import React, { Component } from "react";
import Toolbar from "material-ui/Toolbar";
import AppBar from "material-ui/AppBar";
import Typography from "material-ui/Typography";
import IconButton from "material-ui/IconButton";

const imageStyle = {
  height: "20px",
};

class NavigationBar extends Component {
  render() {
    return (
      <AppBar position="static">
        <Toolbar>
          <IconButton aria-label="Menu">
            <img
              src="https://www.dhis2.org/sites/all/themes/dhis/logo.png"
              style={imageStyle}
              alt="dhis2"
            />
          </IconButton>
          <Typography
            title="GIS Analyzer"
            color="inherit"
            style={{ margin: "auto" }}
          >
            GIS Analyzer
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

export default NavigationBar;
