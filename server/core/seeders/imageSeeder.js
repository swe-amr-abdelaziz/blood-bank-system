const fs = require('fs');
const path = require('path');

const seedImages = async () => {
  const sourceIMG = path.join(__dirname, 'images');
  const destinationIMG = path.join(__dirname, '..', '..', 'files', 'images');

  // Delete old employees images
  await fs.readdir(destinationIMG, (readError, files) => {
    if (readError) throw readError;
    files.forEach((file) => {
      fs.unlink(path.join(destinationIMG, file), (deleteError) => {
        if (deleteError) throw deleteError;
      });
    });
  });

  // Copy new employees images
  await fs.readdir(sourceIMG, (readError, files) => {
    if (readError) throw readError;
    files.forEach((file) => {
      fs.copyFile(path.join(sourceIMG, file), path.join(destinationIMG, file), (copyError) => {
        if (copyError) throw copyError;
      });
    });
  });
};

module.exports = seedImages;
