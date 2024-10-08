import { ActionRowBuilder, StringSelectMenuBuilder } from "@discordjs/builders";
import { Bot } from "../../../../Clients/Bot.client.js";
import { Command } from "../../../../Structures/Command.structure.js";
import Context from "../../../../Structures/Context.structure.js";
import { Emoji } from "../../../../utils/Emotes.utils.js";
import { ComponentType } from "discord.js";

export default class Help extends Command {
  constructor(client: Bot) {
    super(client, {
      name: "help",
      description: {
        content: "Shows the bot's help command",
        examples: ["help"],
        usage: "help",
      },
      category: "Info",
      aliases: ["h"],
      cooldown: 3,
      args: false,
      isPremium: false,
      permissions: {
        dev: false,
        client: ["SendMessages", "ViewChannel", "EmbedLinks"],
        user: [],
      },
      slashCommand: true,
      options: [],
    });
  }
  public async run(client: Bot, ctx: Context): Promise<any> {
    const command = this.client.commands.filter(
      (cmd) => cmd.category !== "Dev"
    );
    const categories = [...new Set(command.map((cmd) => cmd.category))];

    const compos = [
      {
        type: 2,
        style: 5,
        label: "Vote",
        url: "https://top.gg/bot/1044688839005966396/vote",
        emoji: Emoji.vote,
      },
      {
        type: 2,
        style: 5,
        label: "Support",
        url: "https://discord.gg/9bWCU6VPEM",
        emoji: Emoji.support,
      },
    ];

    const homeembed = this.client
      .embed()
      .setAuthor({
        name: `Nirvana's help & command overview`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setDescription(
        `Do visit — https://nirvanabot.pro/ \n\n${command
          .map((cmd) => `**${cmd.name}** — ${cmd.description.content}`)
          .join("\n")}`
      )
      .setColor(this.client.color.main)
      .setTimestamp();

    await ctx.sendMessage({
      embeds: [homeembed],
      components: [
        {
          type: 1,
          components: compos,
        },
      ],
    });

    //     const embed = this.client
    //       .embed()
    //       .setColor(this.client.color.main)
    //       .setAuthor({
    //         name: `Nirvana's help & command overview`,
    //         iconURL: client.user.displayAvatarURL(),
    //       })
    //       .setDescription(``)
    //       .setTimestamp();
    //     const homecollector = msg.createMessageComponentCollector({
    //       filter: (x: { user: { id: string }; deferUpdate: () => any }) =>
    //         x.user.id === ctx.author.id ? true : false && x.deferUpdate(),
    //       componentType: ComponentType.Button,
    //       time: 100000,
    //     });

    //     homecollector.on("collect", async (h) => {
    //       await h.deferUpdate({});
    //       switch (h.customId) {
    //         case "homebut":
    //           msg.edit({
    //             embeds: [homeembed],
    //             components: [
    //               commandsdrop,
    //               {
    //                 type: 1,
    //                 components: compos,
    //               },
    //             ],
    //           });
    //           break;
    //       }
    //     });

    //     homecollector.on("end", async (hend) => {
    //       homecollector.stop;
    //       await msg.edit({
    //         embeds: [homeembed],
    //         components: [
    //           new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    //             drop.setDisabled(true)
    //           ),
    //           {
    //             type: 1,
    //             components: compos,
    //           },
    //         ],
    //       });
    //     });

    //     const collector = msg.createMessageComponentCollector({
    //       filter: (x: { user: { id: string }; deferUpdate: () => any }) =>
    //         x.user.id === ctx.author.id ? true : false && x.deferUpdate(),
    //       componentType: ComponentType.StringSelect,
    //       time: 100000,
    //     });

    //     collector.on("collect", async (i) => {
    //       await i.deferUpdate({});
    //       switch (i.values[0]) {
    //         case "config":
    //           const configcmd = this.client.commands
    //             .filter((cmd) => cmd.category === "Config")
    //             .map((cmd) => `\`${cmd.name}\``)
    //             .join(" | ");
    //           embed.setAuthor({
    //             name: "Configuration Commands",
    //             iconURL: client.user.displayAvatarURL(),
    //           });
    //           embed.setDescription(configcmd);
    //           embed.setFields();

    //           msg.edit({
    //             embeds: [embed],
    //             components: [
    //               {
    //                 type: 1,
    //                 components: home,
    //               },
    //             ],
    //           });
    //           break;
    //         case "info":
    //           const infocmd = this.client.commands
    //             .filter((cmd) => cmd.category === "Info")
    //             .map((cmd) => `\`${cmd.name}\``)
    //             .join(" | ");
    //           embed.setAuthor({
    //             name: "Information Commands",
    //             iconURL: client.user.displayAvatarURL(),
    //           });
    //           embed.setDescription(infocmd);
    //           embed.setFields();

    //           msg.edit({
    //             embeds: [embed],
    //             components: [
    //               {
    //                 type: 1,
    //                 components: home,
    //               },
    //             ],
    //           });
    //           break;
    //         case "filter":
    //           const filtercmd = this.client.commands
    //             .filter((cmd) => cmd.category === "Filters")
    //             .map((cmd) => `\`${cmd.name}\``)
    //             .join(" | ");
    //           embed.setAuthor({
    //             name: "Music Filters",
    //             iconURL: client.user.displayAvatarURL(),
    //           });
    //           embed.setDescription(filtercmd);
    //           embed.setFields();

    //           msg.edit({
    //             embeds: [embed],
    //             components: [
    //               {
    //                 type: 1,
    //                 components: home,
    //               },
    //             ],
    //           });
    //           break;
    //         case "music":
    //           const musiccmd = this.client.commands
    //             .filter((cmd) => cmd.category === "Music")
    //             .map((cmd) => `\`${cmd.name}\``)
    //             .join(" | ");
    //           embed.setAuthor({
    //             name: "Music",
    //             iconURL: client.user.displayAvatarURL(),
    //           });
    //           embed.setDescription(musiccmd);
    //           embed.setFields();

    //           msg.edit({
    //             embeds: [embed],
    //             components: [
    //               {
    //                 type: 1,
    //                 components: home,
    //               },
    //             ],
    //           });
    //           break;
    //         case "mod":
    //           const modcmd = this.client.commands
    //             .filter((cmd) => cmd.category === "Moderation")
    //             .map((cmd) => `\`${cmd.name}\``)
    //             .join(" | ");
    //           embed.setAuthor({
    //             name: "Moderation",
    //             iconURL: client.user.displayAvatarURL(),
    //           });
    //           embed.setDescription(modcmd);
    //           embed.setFields();

    //           msg.edit({
    //             embeds: [embed],
    //             components: [
    //               {
    //                 type: 1,
    //                 components: home,
    //               },
    //             ],
    //           });
    //           break;
    //         case "util":
    //           const utilcmd = this.client.commands
    //             .filter((cmd) => cmd.category === "Utility")
    //             .map((cmd) => `\`${cmd.name}\``)
    //             .join(" | ");
    //           embed.setAuthor({
    //             name: "Utility",
    //             iconURL: client.user.displayAvatarURL(),
    //           });
    //           embed.setDescription(utilcmd);
    //           embed.setFields();

    //           msg.edit({
    //             embeds: [embed],
    //             components: [
    //               {
    //                 type: 1,
    //                 components: home,
    //               },
    //             ],
    //           });
    //           break;
    //         case "allcmd":
    //           const fields = categories.map((category) => ({
    //             name: category,
    //             value: command
    //               .filter((cmd) => cmd.category === category)
    //               .map((cmd) => `\`${cmd.name}\``)
    //               .join(" | "),
    //             inline: false,
    //           }));
    //           embed.setAuthor({
    //             name: `All Commands Overview`,
    //             iconURL: client.user.displayAvatarURL(),
    //           });
    //           embed.setDescription(null);
    //           embed.setFields(...fields);

    //           msg.edit({
    //             embeds: [embed],
    //             components: [
    //               {
    //                 type: 1,
    //                 components: home,
    //               },
    //             ],
    //           });
    //       }
    //     });

    //     collector.on("end", async (cend) => {
    //       homecollector.stop;
    //       await msg.edit({
    //         embeds: [homeembed],
    //         components: [
    //           new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    //             drop.setDisabled(true)
    //           ),
    //           {
    //             type: 1,
    //             components: compos,
    //           },
    //         ],
    //       });
    //     });
  }
}
