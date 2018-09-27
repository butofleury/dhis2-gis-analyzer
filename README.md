# DHIS2 GIS Analyzer

## About

This is a simple DHIS2 Application that uses React and D2, the dhis2 javascript library to create a small reports with all Org Unit of last leve whose GPS point does not fit in the country level (multi) polygon.

## Development

Create a `.env.development` file with at least the following:

    REACT_APP_DHIS2_URL=https://play.dhis2.org/demo
    REACT_APP_BASIC_AUTH=Basic aaabbb
	REACT_APP_USER=admin
	REACT_APP_PASSWORD=....
	REACT_APP_ORG_UNIT_LEVEL=


The basic auth should be a correct header for the DHIS2 you are targetting.

Then:

    yarn install
    yarn start

## Deploy

* Get the last version from Git
* yarn build
* zip the contents of the build folder
* upload to DHIS2
* You may have to "CTRL+R" to get the last version, as the browsers are often using a cache

# Create React App

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

Below you will find some information on how to perform common tasks.<br>
You can find the most recent version of this guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).
