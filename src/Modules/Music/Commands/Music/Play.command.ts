import { LoadType } from "shoukaku";
import { Bot } from "../../../../Clients/Bot.client.js";
import { Command } from "../../../../Structures/Command.structure.js";
import Context from "../../../../Structures/Context.structure.js";
import { AutocompleteInteraction } from "discord.js";

export default class Play extends Command {
  constructor(client: Bot) {
    super(client, {
      name: "play",
      description: {
        content: "Plays a song from YouTube or Spotify",
        examples: [
          "play https://open.spotify.com/track/6WrI0LAC5M1Rw2MnX2ZvEg",
        ],
        usage: "play <song>",
      },
      category: "Music",
      aliases: ["p"],
      cooldown: 3,
      args: true,
      player: {
        voice: true,
        dj: false,
        active: false,
        djPerm: null,
      },
      permissions: {
        dev: false,
        client: [
          "SendMessages",
          "ViewChannel",
          "EmbedLinks",
          "Connect",
          "Speak",
        ],
        user: [],
      },
      slashCommand: true,
      options: [
        {
          name: "song",
          description: "The song you want to play",
          type: 3,
          required: true,
          autocomplete: true,
        },
      ],
    });
  }
  public async run(client: Bot, ctx: Context, args: string[]): Promise<any> {
    const query = args.join(" ");
    // await ctx.sendDeferMessage("Loading...");
    let player = client.queue.get(ctx.guild.id);
    const vc = ctx.member as any;
    if (!player)
      player = await client.queue.create(
        ctx.guild,
        vc.voice.channel,
        ctx.channel
      );

    const res = await this.client.queue.search(query);
    const embed = this.client.embed();

    switch (res.loadType) {
      case LoadType.ERROR:
        player.destroy();
        await ctx.sendMessage({
          content: `There was an error while searching!`,
        });
        break;
      case LoadType.EMPTY:
        await ctx.sendMessage({
          embeds: [
            embed
              .setColor(this.client.color.red)
              .setDescription(
                `**${ctx.author.username}**, No matches found for your search **${query}**`
              ),
          ],
        });
        break;
      case LoadType.TRACK: {
        const track = player.buildTrack(res.data, ctx.author);
        player.queue.push(track);
        await player.isPlaying();
        await ctx.sendMessage({
          embeds: [
            embed
              .setColor(this.client.color.main)
              .setDescription(
                `Added [${res.data.info.title}](${this.client.config.url.support}) by [${res.data.info.author}](${this.client.config.url.support}) to the queue`
              ),
          ],
        });
        break;
      }
      case LoadType.PLAYLIST: {
        console.log(res?.data.info);
        for (const track of res.data.tracks) {
          const pl = player.buildTrack(track, ctx.author);
          player.queue.push(pl);
        }
        await player.isPlaying();
        await ctx.sendMessage({
          embeds: [
            embed
              .setColor(this.client.color.main)
              .setTitle("Playlist added to queue")
              .setDescription(
                `The playlist [${res.data.info.name}](${this.client.config.url.support}) has been added to queue`
              )
              .setFooter({
                text: `${
                  res.data.tracks.length
                } songs, about - ${this.client.botfunctions.formatTime(
                  res.data.tracks.length
                )}`,
              }),
          ],
        });
        break;
      }
      case LoadType.SEARCH: {
        const track1 = player.buildTrack(res.data[0], ctx.author);
        player.queue.push(track1);
        await player.isPlaying();
        await ctx.sendMessage({
          embeds: [
            embed
              .setColor(this.client.color.main)
              .setDescription(
                `Added [${res.data[0].info.title}](${this.client.config.url.support}) by [${res.data[0].info.author}](${this.client.config.url.support}) to the queue`
              ),
          ],
        });
        break;
      }
    }
  }
}
