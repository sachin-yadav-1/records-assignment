const path = require('path');
const fs = require('fs');
const RecordModel = require('./../models/records');
let data = fs.readFileSync(path.join(__dirname, './../data/datajson.txt'), 'utf-8');

/**
 * @description Get all entries from 'datajson.txt' file
 * This route is created because the provided files was in TXT format instead of JSON.
 */
exports.createEntries = async (req, res) => {
  try {
    data = data
      .split('[')[1]
      .slice(0, data.indexOf(']'))
      .replace(/\r?\n|\r/g, (m) => '')
      .replace(/ /g, '')
      .split('},{');

    data = data.map((curr) => {
      if (curr.indexOf(']') > -1) {
        curr = curr.replace('}];', '');
      }
      curr = curr[0] === '{' ? (curr = curr + '}') : (curr = '{' + curr + '}');
      curr = JSON.parse(utils.JSONize(curr));
      return curr;
    });

    const records = await RecordModel.insertMany(data);
    return res.status(201).json({
      status: 'success',
      message: 'Records created successfully!',
      data: records,
    });
  } catch (e) {
    console.log('CREATE RECORDS ERROR', e);
  }
};

/**
 * @description Get all entries
 */
exports.getAllEntries = async (req, res) => {
  try {
    const data = req.query;

    const filter = {};
    if (data.id) filter['id'] = data.id;
    if (data.color) filter['color'] = data.color;
    if (data.disposition) filter['disposition'] = data.disposition;

    const records = await RecordModel.find(filter);
    return res.status(200).json({
      status: 'success',
      message: 'Records fetched successfully!',
      data: records,
    });
  } catch (e) {
    console.log('GET RECORDS ERROR', e);
  }
};

/**
 * @description Get paginated and managed records
 */
exports.getManagedRecords = async (req, res) => {
  try {
    const data = req.query;
    const page = +data.page || 1;
    const limit = +data.limit || 10;
    const skip = (page - 1) * limit;

    const aggregationQuery = [];
    if (skip) aggregationQuery.push({$skip: skip});

    const records = await RecordModel.aggregate([
      ...aggregationQuery,
      { $limit: limit },
      {
        $project: {
          _id: 1,
          id: 1,
          color: 1,
          disposition: 1,
          closedCount: { $sum: { $cond: [{ $eq: ['$disposition', 'closed'] }, 1, 0] }},
        },
      },
      {
        $group: {
          _id: null,
          closedCount: { $sum: { $cond: [{ $eq: ['$disposition', 'closed'] }, 1, 0] }},
          openItems: {
            $push: {
              $cond: [
                { $eq: ['$disposition', 'open'] },
                { _id: '$_id', id: '$id', color: '$color', disposition: '$disposition' },
                '$$REMOVE',
              ],
            },
          },
          ids: { $push: '$id' },
        },
      },
      {
        $facet: {
            metadata: [
              { $count: 'total' }, 
              { $addFields: { 
                  nextPage: page + 1, 
                  ...(page > 1 && {previousPage: page - 1}) 
                }
              }
            ],
            data: [],
        },
      },  
    ]);

    return res.status(200).json(records[0]);
  } catch (e) {
    console.log('GET MANAGED RECORDS ERROR', e);
  }
};
