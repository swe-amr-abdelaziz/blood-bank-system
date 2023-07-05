exports.filter = (request) => {
  const filter = {
    'donor.nationalId': { $regex: request.query.nationalId || '', $options: 'i' },
    'donor.name': { $regex: request.query.name || '', $options: 'i' },
    'donor.email': { $regex: request.query.email || '', $options: 'i' },
    'city.name': { $regex: request.query.city || '', $options: 'i' },
    status: 'Pending',
  };

  return filter;
};

exports.sort = (request) => {
  let order = 1;
  if (request?.query.order === 'desc') {
    order = -1;
  }

  switch (request?.query.sort) {
    case 'nationalId':
      return { nationalId: order };
    case 'name':
      return { name: order };
    case 'email':
      return { email: order };
    case 'city':
      return { city: order };
    default:
      return { createdAt: order };
  }
};

exports.allPendingDonationsProjection = {
  _id: 0,
  id: '$_id',
  city: { $arrayElemAt: ['$city', 0] },
  donor: { $arrayElemAt: ['$donor', 0] },
  status: 1,
  createdAt: 1,
};

exports.lookupArray = [
  {
    from: 'donors',
    let: { donorId: '$donor' },
    pipeline: [
      {
        $match: {
          $expr: { $eq: ['$_id', '$$donorId'] },
        },
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
          nationalId: 1,
          name: 1,
          email: 1,
        },
      },
    ],
    as: 'donor',
  },
  {
    from: 'cities',
    let: { cityId: '$city' },
    pipeline: [
      {
        $match: {
          $expr: { $eq: ['$_id', '$$cityId'] },
        },
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
          name: 1,
        },
      },
    ],
    as: 'city',
  },
];
