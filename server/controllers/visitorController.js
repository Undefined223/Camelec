const UAParser = require('ua-parser-js');
const Visitor = require('../models/visitorModel');

exports.trackVisitor = async (req, res) => {
    try {
      const userAgent = req.headers['user-agent'];
      const parser = new UAParser();
      const result = parser.setUA(userAgent).getResult();
  
      // Determine device type
      let deviceType = result.device.type || 'unknown';
      if (!result.device.type && (result.os.name || result.browser.name)) {
        deviceType = 'desktop';
      }
      deviceType = deviceType.toLowerCase(); // Ensure consistency
  
      // Normalize to start of day (UTC)
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
  
      // Update or insert the record
      await Visitor.findOneAndUpdate(
        { date: today, deviceType },
        { $inc: { count: 1 } },
        { upsert: true, new: true }
      );
  
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Tracking error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  exports.getVisitorCount = async (req, res) => {
    try {
      const { groupBy } = req.query; // Optional: 'daily' | 'device'
  
      const aggregation = [];
  
      // Group by date and device type by default
      aggregation.push({
        $group: {
          _id: {
            date: "$date",
            deviceType: "$deviceType"
          },
          totalVisits: { $sum: "$count" }
        }
      });
  
      // Optional grouping for totals
      if (groupBy === 'device') {
        aggregation.push({
          $group: {
            _id: "$_id.deviceType",
            totalVisits: { $sum: "$totalVisits" }
          }
        });
      } else if (groupBy === 'daily') {
        aggregation.push({
          $group: {
            _id: "$_id.date",
            totalVisits: { $sum: "$totalVisits" },
            devices: {
              $push: {
                deviceType: "$_id.deviceType",
                visits: "$totalVisits"
              }
            }
          }
        });
      }
  
      const results = await Visitor.aggregate(aggregation);
      
      res.status(200).json(results);
    } catch (error) {
      console.error('Fetch error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };