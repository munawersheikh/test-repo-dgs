const psd415 = require('../apiresponses/415_3_mins_PsdData.json');
const psdListing = require('../apiresponses/117_PsdData.json');

exports.getPsd = async (req,res) => {
    try {
        

        let { count, start_time, end_time,mask_start_time,mask_end_time,threshold,job_recid,} = req.query;  

        count = parseInt(count); 
        start_time = String(start_time);
        end_time = String(end_time);
        mask_start_time = String(mask_start_time);
        mask_end_time = String(mask_end_time);
        threshold = String(threshold);
        job_recid = String(job_recid);
      

        const key = Object.keys(psdListing)[0]
        if(key === job_recid){
            return res.status(200).json(psdListing[job_recid]);
          
        }
        else{
            return res.status(404).json({ message: `No data for Job RecId: ${job_recid}` });
        }


        // console.log(typeof key, key);
    
        // res.status(201).json({ message: messages.application.created, application });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};