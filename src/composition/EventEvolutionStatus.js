import React, { Component } from "react";
import Api from "../lib/Api";
import {
  dataAggregatorEvolutionStatus,
  COLUMNS_STATUS_EVOLUTION,
  SHOWN_FIELDS,
} from "../lib/Queries";
import {
  filterAgregatedByProvinceSelected,
  applyAllFiltersOnEvolutionStatus,
} from "../lib/Filters";
import { CSVLink } from "react-csv";
import ProvinceSelector from "../ProvinceSelector";
import AggregationLevelSelector from "../AggregationLevelSelector";
import {
  PagingState,
  IntegratedPaging,
  DataTypeProvider,
} from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableHeaderRow,
  PagingPanel,
  TableColumnVisibility,
} from "@devexpress/dx-react-grid-material-ui";
import _ from "lodash";
import Typography from "material-ui/Typography";
import { LinearProgress } from "material-ui/Progress";
import Button from "material-ui/Button";

const PercentageFormatter = ({ value }) => {
  return <b>{value}%</b>;
};

const PercentageProvider = props => (
  <DataTypeProvider formatterComponent={PercentageFormatter} {...props} />
);

const PAGE_SIZE = 20;
class EventEvolutionStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allRows: [],
      columns: [],
      aggregationLevel: "provinceName",
      filter: {
        province: "",
      },
      hiddenColumnNames: props.hiddenColumnNames,
      defaultHiddenColumnNames: props.hiddenColumnNames,
    };
    this.hiddenColumnNamesChange = hiddenColumnNames => {
      this.setState({ hiddenColumnNames });
    };
  }

  async componentDidMount() {
    this.loadData(this.props.request());
  }

  changeAggregationLevel = level => {
    let hiddenColumnNames = _.difference(
      this.state.defaultHiddenColumnNames,
      SHOWN_FIELDS[level],
    );
    if (level === "pays") {
      hiddenColumnNames.push("provinceName");
      var indexOfCountryLevel = hiddenColumnNames.indexOf("pays");
      hiddenColumnNames.splice(indexOfCountryLevel, 1);
    }
    let excel_header = this.state.columns
      .filter(header => hiddenColumnNames.indexOf(header.name) === -1)
      .map(header => {
        return { label: header.title, key: header.name };
      });

    this.setState({
      aggregationLevel: level,
      hiddenColumnNames,
      csvHeader: excel_header,
    });
    this.applyFilter(level);
  };
  applyFilter(level) {
    let filteredRows = applyAllFiltersOnEvolutionStatus(level, this.state);
    this.setState({ filteredRows });
  }

  filterHandler = (data, value) => {
    let filter = this.state.filter;

    filter[data] = value;
    this.setState({ filter });

    let rows = filterAgregatedByProvinceSelected(this.state);
    this.setState({
      filteredRows: dataAggregatorEvolutionStatus(
        rows,
        this.state.aggregationLevel,
      ),
    });
  };

  async loadData(request) {
    let orgUnits = await this.props.orgUnits();

    Api.getEventAnalyticsRequest(request).then(events => {
      let columns = [
        { name: "pays", title: "Pays" },
        { name: "provinceName", title: "Province" },
        { name: "zoneName", title: "Zone" },
        { name: "areaName", title: "Aire" },
        { name: "count", title: this.props.type },
        { name: "maintained", title: "Maintenu" },
        { name: "lost", title: "Perdu" },
        { name: "recovered", title: "Restauré" },
        { name: "notrecovered", title: "Non restauré" },
      ];
      events.headers.forEach(header => {
        columns.push({ name: header.name, title: header.column });
      });

      let excelHeader = columns
        .filter(header => !this.state.hiddenColumnNames.includes(header.name))
        .map(header => {
          return { label: header.title, key: header.name };
        });

      let rows = events.rows.map(row =>
        this.props.mapper(row, orgUnits.entities),
      );

      this.setState({
        ous: orgUnits,
        allRows: rows,
        filteredRows: dataAggregatorEvolutionStatus(
          rows,
          this.state.aggregationLevel,
        ),
        columns: columns,
        csvHeader: excelHeader,
      });
    });
  }

  render() {
    return (
      <div>
        <Typography variant="display2">
          Rapport sur l'évolution des visites des {this.props.type}
        </Typography>
        {this.state.allRows.length === 0 ? (
          <div>
            <LinearProgress color="secondary" />
          </div>
        ) : (
          <div>
            <AggregationLevelSelector
              aggregationHandler={this.changeAggregationLevel}
            />
            <ProvinceSelector
              provinces={this.state.ous.provinces}
              filterHandler={this.filterHandler}
            />
            <Grid rows={this.state.filteredRows} columns={this.state.columns}>
              <PercentageProvider for={COLUMNS_STATUS_EVOLUTION} />
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
              data={this.state.filteredRows}
              headers={this.state.csvHeader}
              filename={this.props.type + "evolutiontatus.csv"}
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

export default EventEvolutionStatus;
