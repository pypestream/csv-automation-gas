export const getIntentFormat = (csv) => {
  const normalHeader = ['Utterance', 'Intent', 'Type'];
  const simplifiedHeader = ['Utterance', 'Intent'];

  if (csv) {
    const endOfLine = csv.indexOf('\n');
    if (endOfLine) {
      const firstLine = csv.substr(0, endOfLine);
      if (normalHeader.every((header) => firstLine.indexOf(header) >= 0)) {
        return 'non-simplified';
      }
      if (simplifiedHeader.every((header) => firstLine.indexOf(header) >= 0)) {
        return 'simplified';
      }
    }
  }
};
