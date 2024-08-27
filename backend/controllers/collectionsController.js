const collectionListing = require('../apiresponses/newProdCollectionListing.json');

exports.getCollections = async (req,res) => {
    try {
        

      let { limit, start } = req.query;  
  
      limit = parseInt(limit); 
      start = parseInt(start);  
    
      
      if (!isNaN(start) && start >= 0 && start < collectionListing.records.length) {
        filteredRecords = collectionListing.records.slice(start);
      } else {
        filteredRecords = collectionListing.records;
      }
    
      
      if (!isNaN(limit) && limit > 0) {
        filteredRecords = filteredRecords.slice(0, limit);
      }
    
      
      res.json({
        count: collectionListing.count,
        records: filteredRecords
      });

        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};