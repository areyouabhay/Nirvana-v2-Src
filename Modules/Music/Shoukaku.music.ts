/* eslint-disable */

import { Connectors, NodeOption, Shoukaku } from "shoukaku";

import { Bot } from "../../Clients/Bot.client.js";

export class ShoukakuClient extends Shoukaku {
  [x: string]: any;
  public client: Bot;
  constructor(client: Bot, lavanodes: NodeOption[]) {
    super(new Connectors.DiscordJS(client), lavanodes, {
      resume: true,
      resumeTimeout: 30,
      resumeByLibrary: true,
      reconnectTries: 5,
      reconnectInterval: 5,
      restTimeout: 60,
      moveOnDisconnect: false,
      userAgent: `Nirvana Bot`,
      nodeResolver: (nodes) =>
        [...nodes.values()]
          .filter((node) => node.state === 2)
          .sort((a, b) => a.penalties - b.penalties)
          .shift(),
    });
    this.client = client;
    this.on("ready", (name, reconnected) => {
      this.client.shoukaku.emit(
        reconnected ? "nodeReconnect" : ("nodeConnect" as any),
        name
      );
    });
    this.on("error", (name, error) => {
      this.client.shoukaku.emit("nodeError" as any, name, error);
    });
    this.on("close", (name, code, reason) => {
      this.client.shoukaku.emit("nodeDestroy" as any, name, code, reason);
    });
    this.on("disconnect", (name, count) => {
      this.client.shoukaku.emit("nodeDisconnect" as any, name, count);
    });
    this.on("debug", (name, reason) => {
      this.client.shoukaku.emit("nodeRaw" as any, name, reason);
    });
  }
}
