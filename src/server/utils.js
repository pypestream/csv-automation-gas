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

export { createBlob, createCSVFromSheet };
