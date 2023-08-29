const { MongoClient } = require('mongodb')

const databaseMiddleware = async (req, res, next) => {
    try {
        const mongoclient = await new MongoClient('mongodb://mongo:FCeM2O5XuJjMpiFjlcd7@containers-us-west-39.railway.app:6837').connect()
        db = mongoclient.db('week10')

        req.db = db

        next()
    } catch (error) {
        console.log(error, `<=================== error ==================`);
    }
}

module.exports = databaseMiddleware