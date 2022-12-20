const createBlob = (data, type = 'text/plain') => Utilities.newBlob(data, type);

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
