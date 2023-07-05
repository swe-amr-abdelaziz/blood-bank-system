exports.filter = (request) => {
  const filter = {
    group: request.query.group || '',
    hospitalRequested: null,
  };

  return filter;
};

exports.allStockProjection = {
  _id: 0,
  id: '$_id',
  group: 1,
  bloodBankCity: 1,
  expirationDate: 1,
};

exports.lookupObj = {
  from: 'cities',
  let: { bloodBankCityId: '$bloodBankCity' },
  pipeline: [
    {
      $match: {
        $expr: { $eq: ['$_id', '$$bloodBankCityId'] },
      },
    },
    {
      $project: {
        _id: 0,
        id: '$_id',
        name: 1,
        location: 1,
      },
    },
  ],
  as: 'bloodBankCity',
};
