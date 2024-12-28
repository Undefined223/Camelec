const jwt = require('jsonwebtoken')


const generateResetToken = (userId) => {
    const payload = { userId };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Base64 encode the token and remove padding characters ('=')
    const encodedToken = Buffer.from(token).toString('base64').replace(/=/g, '');

    return encodedToken;
};

module.exports = generateResetToken;
