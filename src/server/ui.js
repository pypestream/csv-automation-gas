import { getApiService } from './auth';
import { getPublishDetails } from './utils';

// Menu and Menu Items
export const onOpen = () => {
  const menu = SpreadsheetApp.getUi()
    .createMenu('CSV Publish') // edit me!
    .addItem('Publish to Sandbox', 'showPublishSidebarSandbox')
    .addItem('Publish to Live', 'showPublishSidebarLive')
    .addItem('Open Publish Settings', 'showPublishDetailsModal')
    // Temporary method to delete script properties for testing purposes.
    .addItem(
      'Delete Properties [Temporary, for testing]',
      'deleteAllProperties'
    );

  menu.addToUi();
};

// Auth Flow UI
export const showAuthSidebar = () => {
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

// Publish Flow UI
export const openPublishSolutionSidebar = (env) => {
  const data = getPublishDetails();
  if (!data) {
    showPublishDetailsModal();
    return;
  }
  let html;
  if (env === 'sandbox') {
    html = HtmlService.createHtmlOutputFromFile(
      'publish-sidebar-sandbox'
    ).setTitle(`Publishing Solution to Sandbox`);
  } else {
    html = HtmlService.createHtmlOutputFromFile(
      'publish-sidebar-live'
    ).setTitle(`Publishing Solution to Live`);
  }
  SpreadsheetApp.getUi().showSidebar(html);
};

export const showPublishSidebarSandbox = () => {
  const Authservice = getApiService();
  if (Authservice.hasAccess()) {
    openPublishSolutionSidebar('sandbox');
  } else {
    showAuthSidebar();
  }
};

export const showPublishSidebarLive = () => {
  const Authservice = getApiService();
  if (Authservice.hasAccess()) {
    showConfirmationOnLivePublish(openPublishSolutionSidebar);
  } else {
    showAuthSidebar();
  }
};

export const closeSidebar = () => {
  const html = HtmlService.createHtmlOutput(
    '<script>google.script.host.close();</script>'
  );
  SpreadsheetApp.getUi().showSidebar(html);
};

// Publish Details Modal UI
export const openPublishDetailsDialog = () => {
  const Authservice = getApiService();
  if (Authservice.hasAccess()) {
    const html = HtmlService.createHtmlOutputFromFile('publish-details')
      .setWidth(600)
      .setHeight(600);
    SpreadsheetApp.getUi().showModalDialog(html, 'Publish Details');
  } else {
    showAuthSidebar();
  }
};

export const showPublishDetailsModal = () => {
  const Authservice = getApiService();
  if (Authservice.hasAccess()) {
    openPublishDetailsDialog();
  } else {
    showAuthSidebar();
  }
};

export const closeModal = () => {
  const html = HtmlService.createHtmlOutput(
    '<script>google.script.host.close();</script>'
  )
    .setWidth(600)
    .setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(html, 'Publish Dialog');
};

export const showConfirmationOnLivePublish = (callback) => {
  const data = getPublishDetails();
  if (!data) {
    showPublishDetailsModal();
    return;
  }
  const { customerName, solutionName } = data;
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    'Publishing to Live!',
    `Are you sure you want to publish below solution to Live environment ?\n Customer - ${customerName}\n Solution - ${solutionName}`,
    ui.ButtonSet.YES_NO
  );

  // Process the user's response.
  if (response === ui.Button.YES) {
    callback('live');
  } else {
    Logger.log('Denied publishing to Live env.');
  }
};
