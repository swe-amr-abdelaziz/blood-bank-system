const fs = require('fs');
const path = require('path');

const seedPDF = async () => {
  const sourcePDF = path.join(__dirname, 'pdf');
  const destinationPDF = path.join(__dirname, '..', '..', 'files', 'pdf');

  // Delete old hospitals PDFs
  await fs.readdir(destinationPDF, (readError, files) => {
    if (readError) throw readError;
    files.forEach((file) => {
      fs.unlink(path.join(destinationPDF, file), (deleteError) => {
        if (deleteError) throw deleteError;
      });
    });
  });

  // Copy new hospitals PDFs
  await fs.readdir(sourcePDF, (readError, files) => {
    if (readError) throw readError;
    files.forEach((file) => {
      fs.copyFile(path.join(sourcePDF, file), path.join(destinationPDF, file), (copyError) => {
        if (copyError) throw copyError;
      });
    });
  });
};

module.exports = seedPDF;
