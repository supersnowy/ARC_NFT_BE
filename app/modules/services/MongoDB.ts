import { Db, MongoClient } from 'mongodb';
import { config } from '../../config/config';

export class MongoDBService {
    private client = null as MongoClient;
    private dbname = "" as string;
    private db = null;
    private password = "" as string;
    private username = "" as string;
    private host = "" as string;

    constructor(dbName?: string) {
        console.log(config.mongodb);
        this.dbname = dbName ?? config.mongodb.database;
        this.password = encodeURIComponent(config.mongodb.password);
        this.username = encodeURIComponent(config.mongodb.username);
        this.host = config.mongodb.host;

        const connectionStr = `mongodb://${this.username}:${this.password}@${this.host}?authMecanism=DEFAULT`;

        this.client = new MongoClient(connectionStr);
    }

    /**
     * Connect to the mongodb instance for the given
     * db name and returns its connection.
     * @returns {Promise<Db>} the mongodb connection
     */
    connect(): Promise<Db> {
        return new Promise((resolve, reject): Promise<Db> => {
            try {
                this.client.connect((err) => {
                    if (err) reject(err);
                    else {
                        this.db = this.client.db(this.dbname);
                        resolve(this.db);
                    }
                });
            } catch (error) {
                reject(error);
                return;
            }
        });
    }

    /**
     * Closes the connection with the server
     */
    disconnect() {
        this.client.close();
    }
}