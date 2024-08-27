const { response } = require('express');
const chopListing = require('../apiresponses/chopResponse.json');
const chop417Data = require('../apiresponses/417_Chop_Data.json');

exports.getChop = async (req, res) => {
  try {
    let {limit, offset, collect_start, collect_end } = req.query;

    let job_recid = parseInt(req.params.id);
    limit = parseInt(limit);
    offset = parseInt(offset);
    collect_start = String(collect_start);
    collect_end = String(collect_end);

   // console.log(job_recid);

    // Check if there is any item in chopListing that matches the job_recid
    const matchingRecord = chop417Data.data.every(record => record.job_recid === job_recid);

    if (matchingRecord) {
      return res.status(200).json(chop417Data.data);
    } else {
      return res.status(404).json({ message: `No data for Job RecId: ${job_recid}` });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
