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

const savePublishDetails = ({ customerName, solutionName }) => {
  try {
    // Set multiple script properties in one call.
    const scriptProperties = PropertiesService.getDocumentProperties();
    scriptProperties.setProperties({
      customerName,
      solutionName,
    });
    return;
  } catch (err) {
    // eslint-disable-next-line consistent-return
    throw new Error(err);
  }
};

const getPublishDetails = () => {
  try {
    // Set multiple script properties in one call.
    const scriptProperties = PropertiesService.getDocumentProperties();
    const data = scriptProperties.getProperties();
    if (Object.keys(data).length) {
      return data;
    }
    return null;
  } catch (err) {
    return Error(err);
  }
};

const deleteAllProperties = () => {
  const properties = PropertiesService.getDocumentProperties();
  properties.deleteAllProperties();
};

export {
  createBlob,
  createCSVFromSheet,
  savePublishDetails,
  getPublishDetails,
  deleteAllProperties,
};
