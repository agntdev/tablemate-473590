import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { inlineButton, inlineKeyboard } from "../toolkit/index.js";

// The /start handler renders the bot's MAIN MENU — the primary way users operate
// a button-first bot. A feature adds its own button by calling
// `registerMainMenuItem(...)` in its own `src/handlers/<slug>.ts`; this handler
// renders whatever is registered (plus a Help button), so you do NOT edit this
// file to add a feature. Send ONE message — no placeholder line above the menu.
const composer = new Composer<Ctx>();

const WELCOME = "👋 Welcome! Select your options below.";

const BOOK_TABLE = "Book Table";
const VIEW_BOOKINGS = "View Bookings";

const MENU = [
  [{ text: BOOK_TABLE, callback_data: "booking:start" }],
  [{ text: VIEW_BOOKINGS, callback_data: "owner:dashboard" }],
];

composer.command("start", async (ctx) => {
  await ctx.reply(WELCOME, { reply_markup: inlineKeyboard(MENU) });
});

// "Back to menu" — re-render the main menu in place from any sub-view.
const backToMenu = inlineKeyboard([[inlineButton("⬅️ Back to menu", "menu:main")]]);
composer.callbackQuery("menu:main", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText(WELCOME, { reply_markup: inlineKeyboard(MENU) });
});

export default composer;
