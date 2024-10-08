import moment from "moment";
import chalk from "chalk";
import { Bot } from "../Clients/Bot.client.js";


export default class Logger {
  private client: Bot;
  constructor(client) {
    this.client = client;
  }
  error(error: string, content: string): void {
    const date = `${moment().format("DD-MM-YYYY hh:mm:ss")}`;
    console.error(
      chalk.yellow(`[${date}] : [LOGS] ->`),
      chalk.red(` [${error}] =>  ${content}`)
    );
    this.client.botfunctions.webhooklog("error", content,error);
  }
  warn(error: string, content: string): void {
    const date = `${moment().format("DD-MM-YYYY hh:mm:ss")}`;
    console.error(
      chalk.yellow(`[${date}] : [LOGS] ->`),
      chalk.gray(` [${error}] =>  ${content}`)
    );
    this.client.botfunctions.webhooklog("warn", content,error);
  }

  debug(name: string, content: string): void {
    const date = `${moment().format("DD-MM-YYYY hh:mm:ss")}`;
    console.log(
      chalk.yellow(`[${date}] : [DEBUG] ->`),
      chalk.magenta(` [${name}] =>  ${content}`)
    );
    this.client.botfunctions.webhooklog("misc",content,name)
  }

  event(name: string, content: string): void {
    const date = `${moment().format("DD-MM-YYYY hh:mm:ss")}`;
    console.log(
      chalk.yellow(`[${date}] : [Events] ->`),
      chalk.cyan(` [${name}] =>  ${content}`)
    );
    this.client.botfunctions.webhooklog("event", content,name);
  }

  log(name: string, content: string): void {
    const date = `${moment().format("DD-MM-YYYY hh:mm:ss")}`;
    console.log(
      chalk.yellow(`[${date}] : [LOGS] ->`),
      chalk.greenBright(` [${name}] =>  ${content}`)
    );
    this.client.botfunctions.webhooklog("logs", content,name);
  }

  command(name: string, content: string): void {
    const date = `${moment().format("DD-MM-YYYY hh:mm:ss")}`;
    console.log(
      chalk.yellow(`[${date}] : [COMMAND] ->`),
      chalk.greenBright(` [${name}] =>  ${content}`)
    );
    this.client.botfunctions.webhooklog("command", content,name);
  }
  node(name: string, content: string): void {
    const date = `${moment().format("DD-MM-YYYY hh:mm:ss")}`;
    console.log(
      chalk.yellow(`[${date}] : [NODE] ->`),
      chalk.greenBright(` [${name}] =>  ${content}`)
    );
    this.client.botfunctions.webhooklog("node", content,name);
  }
  player(name: string, content: string): void {
    const date = `${moment().format("DD-MM-YYYY hh:mm:ss")}`;
    console.log(
      chalk.yellow(`[${date}] : [LOGS] ->`),
      chalk.greenBright(` [${name}] =>  ${content}`)
    );
    this.client.botfunctions.webhooklog("player", content,name);
  }
}
