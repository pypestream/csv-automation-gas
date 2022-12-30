import { getApiService } from './auth';

export const onOpen = () => {
  const menu = SpreadsheetApp.getUi()
    .createMenu('Upload and Publish CSV') // edit me!
    .addItem('Click To Begin', 'showModal')
    .addItem('Logout', 'logout');

  menu.addToUi();
};

const showSidebar = () => {
  const Authservice = getApiService();
  let html = '';
  if (Authservice.hasAccess()) {
    html = HtmlService.createHtmlOutput(
      `Already logged in, please close the sidebar`
    );
  } else {
    html = HtmlService.createHtmlOutputFromFile('auth-sidebar').setTitle(
      'Login to Pypestream'
    );
  }
  SpreadsheetApp.getUi().showSidebar(html);
};

export const openDialog = () => {
  const html = HtmlService.createHtmlOutputFromFile('modal-dialog')
    .setWidth(600)
    .setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(html, 'Open Publish Dialog');
};

export const authorizeSidebar = () => {
  const Authservice = getApiService();
  const authorizationUrl = Authservice.getAuthorizationUrl();
  return authorizationUrl;
};

export const authCallback = (request) => {
  const apiService = getApiService();
  const isAuthorized = apiService.handleCallback(request);
  if (isAuthorized) {
    return HtmlService.createHtmlOutputFromFile('auth-tab')
      .setWidth(600)
      .setHeight(600);
  }
  return HtmlService.createHtmlOutput('Denied. You can close this tab');
};

export const closeSidebar = () => {
  const html = HtmlService.createHtmlOutput(
    '<script>google.script.host.close();</script>'
  );
  SpreadsheetApp.getUi().showSidebar(html);
};

export const closeModal = () => {
  const html = HtmlService.createHtmlOutput(
    '<script>google.script.host.close();</script>'
  );
  SpreadsheetApp.getUi().showModalDialog(html);
};

export const showModal = () => {
  const Authservice = getApiService();
  if (Authservice.hasAccess()) {
    openDialog();
  } else {
    showSidebar();
  }
};

export const logout = () => getApiService().reset();
