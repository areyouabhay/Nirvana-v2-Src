import { Redis } from "ioredis";
import { Bot } from "../Clients/Bot.client";

export default class Caching extends Redis {
  private botclient: Bot;
  constructor(client: Bot) {
    super({
      host: client.config.redis.host ? client.config.redis.host : "localhost",
      port: client.config.redis.port ? client.config.redis.port : 6379,
      db: client.config.redis.db ? client.config.redis.db : 0,
    });
    this.botclient = client;
  }
  public async setValue(
    key: string,
    value: string,
    expiry?: number
  ): Promise<boolean> {
    try {
      if (expiry) {
        await this.set(key, value, "EX", expiry);
      } else {
        await this.set(key, value);
      }
      return true;
    } catch (error) {
      this.botclient.logger.warn(
        "Caching",
        `Error setting the value : ${error}`
      );
      return false;
    }
  }
  public async delValue(key: string): Promise<boolean> {
    if (this.exists(key)) {
      await this.del(key);
      return true;
    } else {
      return false;
    }
  }
  public async getValue(key: string): Promise<string | null> {
    try {
      const value = await this.get(key);
      if (value != null) {
        return value;
      } else {
        this.botclient.logger.warn("Caching", `${key} not found.`);
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  public async updateValue(key: string, value: string): Promise<boolean> {
    try {
      return await this.setValue(key, value);
    } catch (error) {
      this.botclient.logger.warn(
        "Caching",
        `Unexpected error occured : ${error}`
      );
      return false;
    }
  }
  public async checkValue(key: string): Promise<boolean> {
    try {
      const exists = await this.exists(key);
      if (exists) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      this.botclient.logger.warn(
        "Caching",
        `Unexpected error occured : ${error}`
      );
      return false;
    }
  }
}
