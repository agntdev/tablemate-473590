import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { inlineButton, inlineKeyboard } from "../toolkit/index.js";

// Booking-start handler (initiates the guest booking flow). Captures context and
// sends a first-step prompt. Extend with real business logic + multi-step flow.
// Do NOT edit `src/bot.ts` — buildBot() auto-loads this module.
const composer = new Composer<Ctx>();

composer.callbackQuery("booking:start", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply("Select a date for your booking", {
    reply_markup: inlineKeyboard([[inlineButton("⬅️ Back to menu", "menu:main")]]),
  });
});

export default composer;
