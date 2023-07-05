const fs = require('fs');
const path = require('path');

const getImage = (request, response, entity) => {
  const { image } = request.params;
  const extension = image.split('.').slice(-1)[0];
  const imagePath = path.join(__dirname, '..', 'files', 'images', image);

  response.setHeader('Content-Type', `image/${extension}`);

  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      response.setHeader('Content-Type', 'image/jpg');
      fs.createReadStream(
        path.join(__dirname, '..', 'files', 'images', `default${entity}.jpg`),
      ).pipe(response);
    } else {
      fs.createReadStream(imagePath).pipe(response);
    }
  });
};

exports.getEmployeeImage = (request, response) => {
  getImage(request, response, 'Employee');
};

exports.getHospitalImage = (request, response) => {
  getImage(request, response, 'Hospital');
};
