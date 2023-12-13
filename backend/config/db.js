const mongoose = require('mongoose')
const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Mongodb connected successfully on: ${conn.connection.host}`.cyan);
    } catch (error) {
        console.log(error)
        console.log("error ".yellow+error)
        process.exit(1)
    }
}
module.exports = connectDb;