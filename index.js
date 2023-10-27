import clipboardy from "clipboardy";
import { Markup, Telegraf } from "telegraf";
import NyaaService from "./nyaa.js";

const nyaa = new NyaaService([]);

const bot = new Telegraf("5979158347:AAGCMjyfh2B5x7xWY5IGnpbJX_F3Y2SpMTQ");

bot.command("copy", async (ctx) => {
  try {
    // await ctx.reply("Fetching...");
    console.log("Copy: ", ctx.payload);
    const tors = await nyaa.findTorrents(ctx.payload);
    console.log("Torrents: ", tors);

    const buttons = [...tors.splice(0, 5)].map((torrent) => {
      return [Markup.button.callback(torrent.name, `copy-${torrent.id}`)];
    });

    await ctx.reply(
      "Click the button below to copy text",
      Markup.inlineKeyboard([...buttons])
    );
  } catch (error) {
    console.error(error);
  }
});

bot.action(/^copy-(\d+)$/, async (ctx) => {
  const torrentId = ctx.match[1];
  console.log(`TorrentCOPY: ${torrentId}`);

  // console.log("Index: ", idx);
  const selectedTorrent = await nyaa.getTorrentById(torrentId);
  console.log("lstTorrent: ", selectedTorrent);

  await clipboardy.writeSync(selectedTorrent.links.magnet);

  // Using context shortcut
  await ctx.answerCbQuery();
  await ctx.reply(selectedTorrent.links.magnet);
  return ctx.answerCbQuery(`Param: ${ctx.match[1]}! 👍`);
});

bot.action("copy", async (ctx) => {
  // Explicit usage
  await ctx.telegram.answerCbQuery(ctx.callbackQuery.id);
  // const idx = ctx.callbackQuery.data.split(":")[1];
  // console.log("Index: ", idx);
  console.log("lstTorrent: ", await nyaa.getTorrentById(3985443));

  //   await clipboardy.writeSync(selectedTorrent.magnet);

  // Using context shortcut
  await ctx.answerCbQuery();
  await ctx.reply("Copied!");
});

bot.catch((err) => {
  console.log("Error: ", err);
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
