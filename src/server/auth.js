const CLIENT_ID = process.env.GAS_OKTA_CLIENT_ID;
const CLIENT_SECRET = process.env.GAS_OKTA_CLIENT_SECRET;
const AUTH_URL = `${process.env.GAS_OKTA_ISSUER}/v1/authorize`;
const TOKEN_URL = `${process.env.GAS_OKTA_ISSUER}/v1/token`;
const GOOGLE_IDPE = process.env.GAS_OKTA_GOOGLE_IDP_ID;

export const getApiService = () => {
  // eslint-disable-next-line no-undef
  return OAuth2.createService('appscriptoauthokta')
    .setAuthorizationBaseUrl(AUTH_URL)
    .setTokenUrl(TOKEN_URL)
    .setClientId(CLIENT_ID)
    .setClientSecret(CLIENT_SECRET)
    .setCallbackFunction('authCallback')
    .setPropertyStore(PropertiesService.getUserProperties())
    .setScope('openid')
    .setGrantType('authorization_code')
    .setParam('idp', GOOGLE_IDPE);
};

export const callApi = (url, methodOpt, payloadOpt = {}, headersOpt = {}) => {
  const service = getApiService();
  if (service.hasAccess()) {
    // A token is present, but it may be expired or invalid. Make a
    // request and check the response code to be sure.

    // Make the UrlFetch request and return the result.
    const accessToken = service.getAccessToken();
    const method = methodOpt || 'GET';
    const headers = headersOpt || {};
    headers.Authorization = Utilities.formatString('Bearer %s', accessToken);
    let options = {
      headers,
      method,
      muteHttpExceptions: true, // Prevents thrown HTTP exceptions.
    };
    if (payloadOpt) {
      options = {
        ...options,
        ...payloadOpt,
      };
    }
    const resp = UrlFetchApp.fetch(url, options);

    const code = resp.getResponseCode();
    if (code >= 200 && code < 300) {
      const response = resp.getContentText(); // Success
      return JSON.parse(response);
    }
    if (code === 401 || code === 403) {
      // Not fully authorized for this action.
      throw Error(`Backend server error: ${code} - ${resp?.getContentText()}`);
    } else {
      // Handle other response codes by logging them and throwing an
      // exception.
      Logger.log(
        'Backend server error (%s): %s',
        code.toString(),
        resp.getContentText()
      );
      throw Error(`Backend server error: ${code} - ${resp?.getContentText()}`);
    }
  }
  return null;
};

export const logoutPypestream = () => {
  getApiService().reset();
};
