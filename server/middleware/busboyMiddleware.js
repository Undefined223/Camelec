const Busboy = require('busboy');

const busboyMiddleware = (req, res, next) => {
    if (req.method === 'POST' && req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
        const busboy = Busboy({ headers: req.headers });

        req.body = {};
        req.files = [];

        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            const fileData = [];
            file.on('data', (data) => {
                fileData.push(data);
            });

            file.on('end', () => {
                req.files.push({
                    fieldname,
                    originalname: filename,
                    encoding,
                    mimetype,
                    buffer: Buffer.concat(fileData),
                });
            });
        });

        busboy.on('field', (fieldname, val) => {
            req.body[fieldname] = val;
        });

        busboy.on('finish', () => {
            next();
        });

        req.pipe(busboy);
    } else {
        next();
    }
};

module.exports = busboyMiddleware;
