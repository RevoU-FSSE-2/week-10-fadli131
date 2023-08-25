const { MongoClient } = require('mongodb')

const databaseMiddleware = async (req, res, next) => {
    try {
        const mongoclient = await new MongoClient('mongodb://127.0.0.1:27017').connect()
        db = mongoclient.db('week10')

        req.db = db

        next()
    } catch (error) {
        console.log(error, `<=================== error ==================`);
    }
}

module.exports = databaseMiddleware