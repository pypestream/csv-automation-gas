export const onOpen = () => {
  const menu = SpreadsheetApp.getUi()
    .createMenu('Upload and Publish CSV') // edit me!
    .addItem('Click To Begin', 'openDialog');

  menu.addToUi();
};

export const openDialog = () => {
  const html = HtmlService.createHtmlOutputFromFile('modal-dialog')
    .setWidth(600)
    .setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(html, 'Open Publish Dialog');
};
