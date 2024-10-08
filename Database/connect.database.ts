import mongoose from 'mongoose';
import config from '../config.json' with { type: 'json' };
import { Bot } from '../Clients/Bot.client.js';
export default class Connect {
    private client: Bot;
    private config: any;
    constructor(client) {
        this.client = client;
        this.config = config;
    }
    connect() {
        mongoose.connect(this.config.mongo_uri, {
        autoIndex: false,
        connectTimeoutMS: 10000,
        family: 4,
      });
        mongoose.set('strictQuery', true);
        mongoose.Promise = global.Promise;
        mongoose.connection.on("connecting", async (): Promise<void> => {
            await this.client.logger.warn('DATABASE', 'DataBase connecting')

        })

        mongoose.connection.on("reconnected", async (): Promise<void> => {
            await this.client.logger.warn('DATABASE', 'DataBase reconnected')

        })
        mongoose.connection.once("open", async (): Promise<void> => {
            await this.client.logger.log('DATABASE', 'Successfuly Connected To DataBase')

        })
        mongoose.connection.on("disconnected", async (): Promise<void> => {
            await this.client.logger.log('DATABASE', 'DataBase disconnected')

        })
        mongoose.connection.on("error", async (err): Promise<void> => {
            await this.client.logger.error('DATABASE', err)

        })
        return;
    }
}