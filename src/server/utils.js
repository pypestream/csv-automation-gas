const createBlob = (data, type = 'text/plain', filename = '') =>
  Utilities.newBlob(data, type, filename);

const createCSVFromSheet = () => {
  let csv = '';
  const values = SpreadsheetApp.getActiveSpreadsheet()
    .getActiveSheet()
    .getDataRange()
    .getValues();
  values.forEach((e) => {
    csv += `${e.join(',')}\n`;
  });
  return csv;
};

export { createBlob, createCSVFromSheet };
