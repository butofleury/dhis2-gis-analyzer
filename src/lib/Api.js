import { init, getInstance, getManifest } from "d2/lib/d2";

const API_URL = 'https://dhis2.rbf-ng.org/';

class Api {
  /**
   * @param url API endpoint url
   * @param auth Authentication HTTP header content
   */
  constructor(url) {
    this.url = url;
    this.cache = [];
    this.userId = "";
    this.baseUrl = "..";
    this.ignoredStores = [""];
  }

  /**
   * Initialized the Api to a d2 instance.
   * @returns {Api}
   */
  initialize() {
    let headers =
      process.env.NODE_ENV === "development"
        ? {
            Authorization:
              "Basic " +
              btoa(
                process.env.REACT_APP_USER +
                  ":" +
                  process.env.REACT_APP_PASSWORD
              )
          }
        : null;

    this.d2 = getManifest("./manifest.webapp")
      .then(manifest => {
        const baseUrl =
          process.env.NODE_ENV === "production"
            ? manifest.getBaseUrl()
            : this.url;
        console.info("Using URL: " + baseUrl);
        console.info(`Loading: ${manifest.name} v${manifest.version}`);
        console.info(`Built ${manifest.manifest_generated_at}`);
        this.baseUrl = baseUrl;
        return baseUrl + "/api";
      })
      .catch(e => {
        return this.url;
      })
      .then(baseUrl =>
        init({ baseUrl, headers }).then(
          d2 => (this.userId = d2.currentUser.username),
        ),
      );
    return this;
  }

  getCountry() {
    return getInstance().then(d2 =>
      d2.Api.getApi().get(
        "organisationUnits.json?filter=level:eq:2&fields=id,name,coordinates",
      ),
    );
  }

  getOrgUnits() {
    return getInstance().then(d2 =>
      d2.Api.getApi().get(
        "organisationUnits.json?filter=level:eq:'"+btoa(process.env.REACT_ORG_UNIT_LEVEL)+"'&filter=organisationUnitGroups.id:eq:ai3evGOwuGk&filter=coordinates:!null&fields=id,name,coordinates,ancestors[id,name,coordinates]&pageSize=2000",
      ),
    );
  }

  /**
   * Make sure the response status code is 2xx
   * @param response
   */
  successOnly(response) {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    }
    return Promise.reject(response);
  }
}

export default (() => new Api(API_URL).initialize())();
