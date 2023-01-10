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

const getActiveSheetName = () => {
  return SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getName();
};

const savePublishDetails = ({ customerName, solutionName }) => {
  try {
    const sheetName = getActiveSheetName();
    // Set multiple script properties in one call.
    const scriptProperties = PropertiesService.getDocumentProperties();
    const publishData = scriptProperties.getProperties();
    if (!Object.keys(publishData).length) {
      scriptProperties.setProperties({
        customerName,
        solutionName: JSON.stringify({
          [sheetName]: solutionName,
        }),
      });
      return;
    }
    scriptProperties.setProperties({
      customerName,
      solutionName: JSON.stringify({
        ...JSON.parse(publishData.solutionName),
        [sheetName]: solutionName,
      }),
    });
    return;
  } catch (err) {
    // eslint-disable-next-line consistent-return
    throw new Error(err);
  }
};

const getPublishDetails = () => {
  try {
    // Get multiple script properties in one call.
    const scriptProperties = PropertiesService.getDocumentProperties();
    const data = scriptProperties.getProperties();
    const sheetName = getActiveSheetName();
    if (!Object.keys(data).length) {
      return null;
    }
    const { customerName, solutionName } = data;
    const parsedSolution = JSON.parse(solutionName);
    if (!parsedSolution[sheetName]) {
      return null;
    }
    return {
      customerName,
      solutionName: parsedSolution[sheetName],
    };
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
  getActiveSheetName,
  getPublishDetails,
  deleteAllProperties,
};
