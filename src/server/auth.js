const getSheets = () => SpreadsheetApp.getActive().getSheets();

const getActiveSheetName = () => SpreadsheetApp.getActive().getSheetName();

const clientID = '0oa1ge814liY073k70h8';
const clientSecret = 'e3Ebtj5imm277_cbFPhl7M3IxJELVgd7JKTAJ3l6';

// eslint-disable-next-line import/prefer-default-export
export const getSheetsData = () => {
  const activeSheetName = getActiveSheetName();
  return getSheets().map((sheet, index) => {
    const name = sheet.getName();
    return {
      name,
      index,
      isActive: name === activeSheetName,
    };
  });
};

export const getApiService = () => {
  // eslint-disable-next-line no-undef
  return OAuth2.createService('appscriptoauthokta')
    .setAuthorizationBaseUrl(
      'https://auth-preview.pypestream.com/oauth2/ausozswoou0GlWptP0h7/v1/authorize'
    )
    .setTokenUrl(
      'https://auth-preview.pypestream.com/oauth2/ausozswoou0GlWptP0h7/v1/token'
    )
    .setClientId(clientID)
    .setClientSecret(clientSecret)
    .setCallbackFunction('authCallback')
    .setPropertyStore(PropertiesService.getUserProperties())
    .setScope('openid')
    .setGrantType('authorization_code');
};

export const callApi = (url, methodOpt, headersOpt) => {
  const service = getApiService();
  if (service.hasAccess()) {
    // A token is present, but it may be expired or invalid. Make a
    // request and check the response code to be sure.

    // Make the UrlFetch request and return the result.
    const accessToken = service.getAccessToken();
    const method = methodOpt || 'GET';
    const headers = headersOpt || {};
    headers.Authorization = Utilities.formatString('Bearer %s', accessToken);
    const resp = UrlFetchApp.fetch(url, {
      headers,
      method,
      muteHttpExceptions: true, // Prevents thrown HTTP exceptions.
    });

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
