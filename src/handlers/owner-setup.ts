import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { inlineButton, inlineKeyboard } from "../toolkit/index.js";

// Owner setup + dashboard handler (restaurant configuration and booking management).
// Wire into /start via registerMainMenuItem({ label: "View Bookings", data: "owner:dashboard" }) if the
// toolkit exposes it; do NOT add to `src/bot.ts`. Replace the reply body with real
// logic + copy; if you change the user-facing text, update tests/specs EXACTLY.
const composer = new Composer<Ctx>();

composer.command("owner_setup", async (ctx) => {
  await ctx.reply("Configure restaurant settings and table inventory", {
    reply_markup: inlineKeyboard([[inlineButton("⬅️ Back to menu", "menu:main")]]),
  });
});

composer.callbackQuery("owner:dashboard", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply("Today's capacity summary and upcoming bookings", {
    reply_markup: inlineKeyboard([[inlineButton("⬅️ Back to menu", "menu:main")]]),
  });
});

export default composer;
