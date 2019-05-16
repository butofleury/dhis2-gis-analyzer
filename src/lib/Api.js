import { init, getInstance, getManifest } from "d2/lib/d2";
const API_URL = process.env.REACT_APP_DHIS2_URL;

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
        "organisationUnits.json?filter=level:eq:1&fields=id,name,coordinates&filter=id:eq:I7ca90SJzDy",
      ),
    );
  }

  getOrgUnits() {
    return getInstance().then(d2 =>
       d2.Api.getApi().get(
         "organisationUnits.json?fields=id,name,coordinates,ancestors[id,name],parent[parent[parent[coordinates]]]&filter=coordinates:!null&filter=level:eq:6&paging=false"
       )
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
