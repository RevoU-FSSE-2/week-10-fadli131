const { MongoClient } = require('mongodb')

const databaseMiddleware = async (req, res, next) => {
    try {
        const mongoclient = await new MongoClient('mongodb://localhost:27017/').connect()
        db = mongoclient.db('week11')

        req.db = db

        next()
    } catch (error) {
        console.log(error, `<=================== error ==================`);
    }
}

module.exports = databaseMiddleware