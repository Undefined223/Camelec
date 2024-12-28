const UAParser = require('ua-parser-js');
const Visitor = require('../models/visitorModel');

exports.trackVisitor = async (req, res) => {
    try {
        const userAgent = req.headers['user-agent'];
        const parser = new UAParser();
        const result = parser.setUA(userAgent).getResult();
        let deviceType = 'unknown';

        if (result.device.type) {
            deviceType = result.device.type; // mobile, tablet, etc.
        } else if (result.os.name || result.browser.name) {
            deviceType = 'desktop';
        }

        const newVisitor = new Visitor({ count: 1, deviceType });
        await newVisitor.save();

        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getVisitorCount = async (req, res) => {
    try {
        const visitorCount = await Visitor.find();
        res.status(200).json(visitorCount);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
