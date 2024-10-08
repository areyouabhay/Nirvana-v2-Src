import type { Player } from "shoukaku";
import { REST } from "discord.js";
import type { Song } from "../../../Modules/Music/Dispatcher.music.js";
import type Dispatcher from "../../../Modules/Music/Dispatcher.music.js";
import Event from "../../../Structures/Event.structure.js";
import { Bot } from "../../../Clients/Bot.client.js";

export default class TrackEnd extends Event {
  constructor(client: Bot, file: string) {
    super(client, file, {
      name: "trackEnd",
    });
  }

  public async run(
    _player: Player,
    track: Song,
    dispatcher: Dispatcher
  ): Promise<void> {
    dispatcher.previous = dispatcher.current;
    dispatcher.current = null;
    const guild = await this.client.guilds.fetch(_player.guildId);
    const vcId = dispatcher.voiceChannelId;
    const rest = new REST({
      version: "10",
    }).setToken(this.client.config.token);
    const nowPlayingMessage = await dispatcher.nowPlayingMessage
      ?.fetch()
      .catch(() => null);

    switch (dispatcher.loop) {
      case "repeat":
        dispatcher.queue.unshift(track);
        break;
      case "queue":
        dispatcher.queue.push(track);
        break;
    }

    await dispatcher.play();

    if (dispatcher.autoplay) {
      await dispatcher.Autoplay(track);
    }

    if (nowPlayingMessage?.deletable) {
      await nowPlayingMessage.delete().catch(() => {});
    }
    await rest
      .put(`/channels/${vcId}/voice-status`, {
        body: {
          status: ``,
        },
      })
      .catch(() => {});
  }
}
