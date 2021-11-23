import { Markup } from 'telegraf'

export const inlinePaginationButtons = (hideNext: boolean) =>
  Markup.inlineKeyboard([
    [Markup.button.callback('➡️ Show More', 'next', hideNext)],
    [
      Markup.button.callback('👑 Winners', 'winner'),
      Markup.button.callback('🙆‍♂️ All', 'all'),
    ],
  ])

export const menuKeyboard = Markup.keyboard([
  [
    { text: '💰 My Polkadot', hide: false },
    { text: '💰 My Kusama', hide: false },
  ],
  [
    { text: '🟢 Active Polkadot', hide: false },
    { text: '🟢 Active Kusama', hide: false },
  ],
  [{ text: '🔑 Switch account', hide: false }],
]).resize()

export const cancelButton = Markup.keyboard([
  { text: 'Cancel', hide: false },
]).resize()

export const startButton = Markup.keyboard([
  { text: 'Start', hide: false },
]).resize()

