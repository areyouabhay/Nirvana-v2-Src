import { Player } from "shoukaku";
import { Bot } from "../../../Clients/Bot.client.js";
import Dispatcher, { Song } from "../../../Modules/Music/Dispatcher.music.js";
import Event from "../../../Structures/Event.structure.js";
import Canvas from "canvas";
import StackBlur from "stackblur-canvas";
import getColors from "get-image-colors";
import { Emoji } from "../../../utils/Emotes.utils.js";
import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  AttachmentBuilder,
  TextChannel,
  ComponentType,
  ButtonBuilder,
  PermissionFlagsBits,
} from "discord.js";
import { REST } from "discord.js";

export default class TrackStart extends Event {
  constructor(client: Bot, file: string) {
    super(client, file, {
      name: "trackStart",
    });
  }

  public async run(
    _player: Player,
    track: Song,
    dispatcher: Dispatcher
  ): Promise<void> {
    const player = this.client.queue.get(_player.guildId);
    const guild = await this.client.guilds.fetch(_player.guildId);
    const vcId = guild.members.me.voice.channelId;
    const channel = guild.channels.cache.get(
      dispatcher.channelId
    ) as TextChannel;
    if (!channel) return;
    const rest = new REST({
      version: "10",
    }).setToken(this.client.config.token);

    await rest.put(`/channels/${vcId}/voice-status`, {
      body: {
        status: `<a:dance:1266756154730610739> Now Playing: ${track.info.title} By ${track.info.author}`,
      },
    });

    if (
      guild.members.me
        .permissionsIn(channel)
        .has(PermissionFlagsBits.AttachFiles)
    ) {
      PlayerEmbed.setImage("attachment://nirvanamusic.png");
    } else {
      PlayerEmbed.setThumbnail(track.info.artworkUrl!);
    }

    const PlayerButtons1 = [
      {
        type: 2,
        style: 2,
        emoji: Emoji.shuffle,
        custom_id: "shuffle",
      },
      {
        type: 2,
        style: 2,
        emoji: Emoji.previous,
        custom_id: "previous",
      },
      {
        type: 2,
        style: 2,
        emoji: Emoji.pause,
        custom_id: "pause",
      },
      {
        type: 2,
        style: 2,
        emoji: Emoji.skip,
        custom_id: "skip",
      },
      {
        type: 2,
        style: 2,
        emoji: Emoji.loop,
        custom_id: "loop",
      },
    ];

    const RPlayerButtons1 = [
      {
        type: 2,
        style: 2,
        emoji: Emoji.shuffle,
        custom_id: "shuffle",
      },
      {
        type: 2,
        style: 2,
        emoji: Emoji.previous,
        custom_id: "previous",
      },
      {
        type: 2,
        style: 3,
        emoji: Emoji.resume,
        custom_id: "resume",
      },
      {
        type: 2,
        style: 2,
        emoji: Emoji.skip,
        custom_id: "skip",
      },
      {
        type: 2,
        style: 2,
        emoji: Emoji.loop,
        custom_id: "loop",
      },
    ];

    const PlayerButtons2 = [
      {
        type: 2,
        style: 4,
        emoji: Emoji.stop,
        custom_id: "stop",
      },
      {
        type: 2,
        style: 2,
        label: "Quick Filters",
        emoji: Emoji.Qfilters,
        custom_id: "filter",
      },
      {
        type: 2,
        style: 3,
        emoji: "🤍",
        custom_id: "like",
      },
    ];

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("f")
        .setPlaceholder(`Select Filters`)
        .addOptions([
          {
            label: "Reset Filters",
            description: "Clears all filters.",
            value: "reset",
          },
          {
            label: "8D",
            description: "Sets the 8D Filter.",
            value: "8",
          },
          {
            label: "BassBoost",
            description: "Sets the BassBoost Filter.",
            value: "bb",
          },
          {
            label: "Distortion",
            description: "Sets the distortion Filter.",
            value: "d",
          },
          {
            label: "Karaoke",
            description: "Sets the Karaoke Filter.",
            value: "k",
          },
          {
            label: "Lofi",
            description: "Sets the Lofi Filter.",
            value: "l",
          },
          {
            label: "NightCore",
            description: "Sets the NightCore Filter.",
            value: "nc",
          },
          {
            label: "Pitch",
            description: "Sets the Pitch Filter.",
            value: "p",
          },
          {
            label: "Rate",
            description: "Sets the Rate Filter.",
            value: "ra",
          },
          {
            label: "Rotation",
            description: "Sets the Rotation Filter.",
            value: "ro",
          },
          {
            label: "Speed",
            description: "Sets the Speedy Filter.",
            value: "s",
          },
          {
            label: "Tremolo",
            description: "Sets the Tremolo Filter.",
            value: "t",
          },
          {
            label: "Vibrato",
            description: "Sets the Vibrato Filter.",
            value: "v",
          },
        ])
    );

    const message = await channel.send({
      embeds: [PlayerEmbed],
      components: [
        {
          type: 1,
          components: PlayerButtons1,
        },
        {
          type: 1,
          components: PlayerButtons2,
        },
      ],
    });
    dispatcher.nowPlayingMessage = message;
    const collector = message.createMessageComponentCollector({
      filter: (b) => {
        if (
          b.guild.members.me.voice.channel &&
          b.guild.members.me.voice.channelId === b.member.voice.channelId
        )
          return true;
        else {
          b.reply({
            content: `You Are Not Connected To <#${
              b.guild.members.me.voice?.channelId ?? "None"
            }> To Use This Command.`,
            ephemeral: true,
          });
          return false;
        }
      },
    });

    collector.on("collect", async (interaction) => {
      await interaction.deferReply({
        ephemeral: true,
      });
      switch (interaction.customId) {
        case "previous":
          if (dispatcher.previous) {
            dispatcher.previousTrack();
            await interaction.editReply({
              content: `Rewinded the player!`,
            });
          } else {
            await interaction.editReply({
              content: `No previous song available!`,
            });
          }
          break;

        case "pause":
          dispatcher.pause();
          await interaction.editReply({
            content: dispatcher.paused
              ? `Paused the music!`
              : `Resumed the music!`,
          });
          await message.edit({
            components: [
              {
                type: 1,
                components: dispatcher.paused
                  ? RPlayerButtons1
                  : PlayerButtons1,
              },
              {
                type: 1,
                components: PlayerButtons2,
              },
            ],
          });
          break;

        case "resume":
          dispatcher.pause();
          await interaction.editReply({
            content: dispatcher.paused
              ? `Paused the music!`
              : `Resumed the music!`,
          });
          await message.edit({
            components: [
              {
                type: 1,
                components: dispatcher.paused
                  ? RPlayerButtons1
                  : PlayerButtons1,
              },
              {
                type: 1,
                components: PlayerButtons2,
              },
            ],
          });
          break;

        case "skip":
          if (dispatcher.queue.length) {
            dispatcher.skip();
            await interaction.editReply({
              content: `Skipped the Song!`,
            });
          } else {
            await interaction.editReply({
              content: `No more songs in queue!`,
            });
          }
          break;

        case "like":
          // Add & Connect Liked Songs Database
          await interaction.editReply({
            embeds: [
              this.client
                .embed()
                .setAuthor({
                  name: `Nirvana Music`,
                  iconURL: this.client.user.displayAvatarURL(),
                })
                .setDescription(
                  `Added **${track.info.title}** To **Liked Songs** 🤍`
                ),
            ],
          });
          break;

        case "stop":
          dispatcher.destroy();
          await rest.put(`/channels/${vcId}/voice-status`, {
            body: {
              status: ``,
            },
          });
          await interaction.editReply({
            content: `Stopped the music & cleared the queue!`,
          });
          await message.delete();
          break;

        case "lyrics":
          // Lyrics Api
          await interaction.editReply({
            content: `Feature to be released soon!`,
          });
          break;

        case "loop":
          switch (dispatcher.loop) {
            case "off":
              dispatcher.loop = "repeat";
              await interaction.editReply({
                content: `Alright, I'll be looping the **Track**!`,
              });
              break;
            case "repeat":
              dispatcher.loop = "queue";
              await interaction.editReply({
                content: `Alright, I'll be looping the **Queue**!`,
              });

              break;
            case "queue":
              dispatcher.loop = "off";
              await interaction.editReply({
                content: `Alright, I've **Disabled** Looping!`,
              });
              break;
          }
          break;

        case "filter":
          await interaction.editReply({
            content: `<@${interaction.user.id}> Select your favourite **Filters**`,
            embeds: [
              this.client.embed().setFooter({
                text: `Powered by Nirvana Music`,
                iconURL: this.client.user.displayAvatarURL(),
              }),
            ],
            components: [row],
          });
          break;

        case "shuffle":
          dispatcher.setShuffle();
          await interaction.editReply({
            content: `Shuffling the Queue!`,
          });
          break;
      }
    });
  }
}
