const createBlob = (data, type = 'text/plain', filename = '') =>
  Utilities.newBlob(data, type, filename);

const createCSVFromSheet = () => {
  let csv = '';
  const values = SpreadsheetApp.getActiveSpreadsheet()
    .getActiveSheet()
    .getDataRange()
    .getValues();
  values.forEach((e) => {
    csv += `${e
      .map((col) => {
        Logger.log(col);
        return col ? `"${col.toString().replace(/"/g, '""')}"` : col;
      })
      .join(',')}\n`;
  });
  return csv;
};

const savePublishDataToPropertiesService = ({
  customerName,
  solutionName,
  env,
}) => {
  try {
    // Set multiple script properties in one call.
    const scriptProperties = PropertiesService.getDocumentProperties();
    scriptProperties.setProperties({
      customerName,
      solutionName,
      env,
    });
    return;
  } catch (err) {
    // eslint-disable-next-line consistent-return
    return Error(err);
  }
};

const checkPublishDataExistsInPropertiesService = () => {
  try {
    // Set multiple script properties in one call.
    const scriptProperties = PropertiesService.getDocumentProperties();
    const data = scriptProperties.getProperties();
    if (data) {
      return data;
    }
    return null;
  } catch (err) {
    return Error(err);
  }
};

export {
  createBlob,
  createCSVFromSheet,
  savePublishDataToPropertiesService,
  checkPublishDataExistsInPropertiesService,
};
