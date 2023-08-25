const { MongoClient } = require('mongodb')

const databaseMiddleware = async (req, res, next) => {
    try {
        const client = await new MongoClient('mongodb://127.0.0.1:27017').connect()
        db = client.db('week10')

        req.db = db

        next()
    } catch (error) {
        console.log(error, `<=================== error ==================`);
    }
}

module.exports = databaseMiddleware