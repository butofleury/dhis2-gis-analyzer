import React, { Component } from "react";
import Api from "./lib/Api";
import Typography from "material-ui/Typography";
import { LinearProgress } from "material-ui/Progress";
import Button from "material-ui/Button";
import {
  PagingState,
  IntegratedPaging,
  DataTypeProvider,
} from "@devexpress/dx-react-grid";
import inside from "point-in-polygon";
import {
  Grid,
  Table,
  TableHeaderRow,
  PagingPanel,
  TableColumnVisibility,
} from "@devexpress/dx-react-grid-material-ui";
import _ from "lodash";
import { CSVLink } from "react-csv";

const PAGE_SIZE = 20;

const LinkFormatter = ({ value }) => {
  return (
    <a href={value} target="_blank">
      {value}%
    </a>
  );
};

const LinkProvider = props => (
  <DataTypeProvider formatterComponent={LinkFormatter} {...props} />
);

class GISTable extends Component {
  constructor(props) {
    super(props);
    let columns = [
      { name: "l2", title: "l2" },
      { name: "l3", title: "l3" },
      { name: "l4", title: "l4" },
      { name: "id", title: "Id" },
      { name: "name", title: "Name" },
      { name: "gps", title: "GPS" },
      { name: "gisok", title: "GIS OK" },
      { name: "link", title: "OSM link" },
    ];
    this.state = {
      columns,
      rows: [],
      csvHeader: columns.map(header => {
        return { label: header.title, key: header.name };
      }),
      country: undefined,
    };
    this.hiddenColumnNamesChange = hiddenColumnNames => {
      this.setState({
        hiddenColumnNames,
      });
    };
  }

  insideMultiPolygon = (point, multipolygon) => {
    let ok = false;
    multipolygon.forEach(poly => {
      if (inside(point, poly[0])) {
        ok = true;
      }
    });
    return ok;
  };

  async componentDidMount() {
    this.loadData();
  }

  async loadData(request) {
    let countryRequest = await Api.getCountry();
    let orgUnits = await Api.getOrgUnits();
    this.setState(orgUnits);
    console.log(orgUnits);
    let rows = [];
    let country = countryRequest.organisationUnits[0];
    let countryCoords = JSON.parse(country.coordinates);

    orgUnits.organisationUnits.forEach(orgUnit => {
      4;

      let point = JSON.parse(orgUnit.coordinates);
      let gischeck = this.insideMultiPolygon(point, countryCoords);
      if (gischeck === false) {
        rows.push({
          id: orgUnit.id,
          name: orgUnit.name,
          gps: orgUnit.coordinates,
          gisok: gischeck ? "OK" : "KO",
          l2: orgUnit.ancestors[0].name,
          l3: orgUnit.ancestors[1].name,
          l4: orgUnit.ancestors[2].name,
          link: `http://www.openstreetmap.org/?mlat=${point[0]}&mlon=${
            point[1]
          }&zoom=6`,
        });
      }
    });

    this.setState({ rows, country });
  }

  render() {
    return (
      <div>
        <Typography variant="display2">GIS Analyzer</Typography>

        {this.state.rows.length === 0 ? (
          <div>
            <LinearProgress color="secondary" />
          </div>
        ) : (
          <div>
            <Grid rows={this.state.rows} columns={this.state.columns}>
              <LinkProvider for={["link"]} />
              <PagingState defaultCurrentPage={0} pageSize={PAGE_SIZE} />
              <IntegratedPaging />
              <Table />
              <TableHeaderRow />
              <TableColumnVisibility
                hiddenColumnNames={this.state.hiddenColumnNames}
                onHiddenColumnNamesChange={this.hiddenColumnNamesChange}
              />
              <PagingPanel />
            </Grid>
            <CSVLink
              data={this.state.rows}
              headers={this.state.csvHeader}
              filename={"gis-problems.csv"}
              target="_blank"
            >
              <Button color="primary" variant="raised">
                Download as Excel
              </Button>
            </CSVLink>
          </div>
        )}
      </div>
    );
  }
}

export default GISTable;
