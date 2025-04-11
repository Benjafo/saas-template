const dotenv = require('dotenv');
const User = require('./models/user.model');
const Tenant = require('./models/tenant.model');
const Activity = require('./models/activity.model');
const Invoice = require('./models/invoice.model');
const Config = require('./models/config.model');
const connectDB = require('./config/database');

dotenv.config({ path: './config/.env' });

// test the database

const indexes = async () => {
    await connectDB();

    // const configs = await Config.find()
    // console.log('Found configs: ', configs)

    // Config.collection.getIndexes().then(indexes => console.log('Found indexes: ', indexes))
    // Config.collection.dropIndexes()
}

const seestuff = async () => {
    await connectDB();

    const users = await User.find()
    console.log('Users: ', users)
}

seestuff()