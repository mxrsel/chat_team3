import {Db, MongoClient} from 'mongodb'

let database: Db;
let client: MongoClient;

const connect = async() => {
    client = await MongoClient.connect('mongodb://localhost');
    database = client.db('chat');
};

const disconnect = async() => {
    await client.close();
};

const mongoDb = {
    connect,
    disconnect,
    getDb: () => database
};

export default mongoDb;