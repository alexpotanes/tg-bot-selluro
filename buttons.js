import {  WEB_PORTFOLIO, WEB_APP_URL } from './keys.js'

export const buttonsStart = {
  reply_markup: {
    inline_keyboard: [
      [{text: 'Посмотреть примеры работ', web_app: {url: WEB_PORTFOLIO}},{text: 'Оформить подписку и начать', url: 'https://t.me/tribute/app?startapp=sCTT'}],
    ]
  }
};
export const buttonsSub = {
  reply_markup: {
    inline_keyboard: [
      [{text: 'Внести депозит', callback_data: 'deposit'}, {text: 'Поддержка', url: 'https://t.me/Auracaller'}],
    ]
  }
};
export const buttonsDeposit = {
  reply_markup: {
    keyboard: [
      [{text: '🔘  Открыть калькулятор', web_app: {url: WEB_APP_URL + '/form'}}],
    ]
  }
};
export const buttonsTask = {
  reply_markup: {
    keyboard: [
      [
        {text: 'Заполнить тз', web_app: {url: 'https://docs.google.com/forms/d/e/1FAIpQLSdw5pbOVkshGv5P5bje2SxRcZSwmlkqfrJGilUHZrZ00VnT4A/viewform'}},
        {text: 'Поддержка', callback_data: 'help'}
      ]
    ]
  }
};