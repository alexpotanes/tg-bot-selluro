import dotenv from 'dotenv';
import TgApi from 'node-telegram-bot-api';
import {GoogleSpreadsheet} from "google-spreadsheet";
import {JWT} from 'google-auth-library';
import express from 'express';
import cors from 'cors';
import { buttonsStart, buttonsSub, buttonsDeposit, buttonsTask } from './buttons.js';
import {GOOGLE_TABLE_ID, GOOGLE_CLIENT_EMAIL, SCOPES, CHANNEL_ID} from './keys.js'
import { startText, depositText } from './descriptions.js'
import { googleIntegration } from "./googleIntegration.js";
dotenv.config();
let dataTask = {};

const bot = new TgApi('8549555650:AAGxV8KmWZB5NWyJMW1HNWiZBNVWgjDW6i0', { polling: true });
const app = express();
app.use(express.json());
app.use(cors());

const serviceAccountAuth = new JWT({
    email: GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.split(String.raw`\n`).join('\n'),
    scopes: SCOPES,
});
const doc = new GoogleSpreadsheet(GOOGLE_TABLE_ID, serviceAccountAuth);

bot.setMyCommands([
    { command: '/start', description: 'Начальное приветствие' }
]);

const start = async () => {
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = String(msg.chat.id);
        const userId = String(msg.from.id);

        if (text === '/start') {
            const chats = ['-3315805042', '-1002454152888'];  // массив чатов

            Promise.all(
              chats.map(chatId => bot.getChatMember(chatId, userId))
            ).then(async ([chatMember1, chatMember2]) => {
                const isMember1 = ['creator', 'administrator', 'member'].includes(chatMember1.status);
                const isMember2 = ['creator', 'administrator', 'member'].includes(chatMember2.status);

                if (isMember1 || isMember2) {
                    await bot.sendMessage(chatId, `По кнопке ниже можете подсчитать стоимость...`, buttonsSub);
                } else {
                    await bot.sendMessage(chatId, startText, {parse_mode: 'HTML', ...buttonsStart});
                }
            }).catch(async err => {
                console.error('Ошибка проверки групп:', err);
                await bot.sendMessage(chatId, startText, {parse_mode: 'HTML', ...buttonsStart});
            });
        }

        if (msg?.web_app_data?.data) {
            try {
                dataTask = JSON.parse(msg.web_app_data.data);
                const { articles, photo, email } = dataTask;
                const price = (articles * 600) + ((articles * photo) * 40);

                await bot.sendInvoice(
                  chatId,
                  'Ваш заказ',
                  `Количество артикулов: ${articles}                                                           Количество фото на один артикул: ${photo}`,
                  'send-invoice',
                  '390540012:LIVE:87200', // '381764678:TEST:161523'
                  'RUB',
                  [{label: 'Заказ', amount: price*100 }],
                  {
                      provider_data: {
                          receipt: {
                              customer: {
                                  email: email,
                                  phone: ""
                              },
                              items: [
                                  {
                                      description: "Ваш заказ",
                                      quantity: 1,
                                      amount: {
                                          value: price,
                                          currency: "RUB"
                                      },
                                      vat_code: 1,
                                      payment_mode: "full_payment",
                                      payment_subject: "commodity"
                                  }
                              ],
                              tax_system_code: 1
                          }
                      },
                      payment_options: {
                          save_payment_method: true,
                      }
                  }
                );
            } catch (e) {
                console.log(e);
            }
        }
    })

    bot.on('callback_query', async msg => {
        const text = msg.data;
        const chatId = msg.message.chat.id;

        if (text === 'deposit') {
            return  bot.sendMessage(chatId, depositText, buttonsDeposit);
        }
        if (text === 'buttonsDeposit') {
            return  bot.sendMessage(chatId, depositText, buttonsSub);
        }
    })

    bot.on('pre_checkout_query', async data => {
        await bot.answerPreCheckoutQuery(data.id, true);
    })

    bot.on('successful_payment', async data => {
        const targetInvoice = data.successful_payment.invoice_payload;
        const chatId = data.chat.id;
        const username = data.chat.username;
        const name = `${data.chat.first_name} ${data.chat.last_name ? data.chat.last_name : ''}`;

        await doc.loadInfo();

        if (targetInvoice === 'send-invoice') {
            const sheet = doc.sheetsByIndex[3]
            await googleIntegration(sheet, dataTask, chatId, name, username);
            return bot.sendMessage(
              chatId,
              `По кнопке ниже можете подсчитать стоимость, заполнить ТЗ, а затем оплатить услугу`,
              buttonsSub
            );
        }
    })
};

start();

// app.post('/web-data', async (res, req) => {
//     const { queryId, articles, photo } = req.data;
//
//     const price = (articles * 600) + ((articles * photo) * 40);
//     try {
//         await bot.answerWebAppQuery(queryId, {
//             type: 'article',
//             id: queryId,
//             title: 'Заказ успешно создан',
//             input_message_content: {
//                 message_text: `Сумма заказа: ${price}`
//             }
//         });
//         // await doc.loadInfo(); // loads document properties and worksheets
//         // const sheet = doc.sheetsByIndex[0]
//         //
//         // await sheet.addRow({
//         //     id: chatId,
//         //     name: `${msg.from.first_name} ${msg.from.last_name}`,
//         //     message: 'task',
//         //     art: articles ,
//         //     photo,
//         //     price
//         // });
//         return res.status(200).json({});
//     } catch (error) {
//         await bot.answerWebAppQuery(queryId, {
//             type: 'article',
//             id: queryId,
//             title: 'Не удалось создать заказ',
//             input_message_content: {
//                 message_text: `Не удалось создать заказ`
//             }
//         });
//         return res.status(500).json({});
//     }
// });
//
// const PORT = 8000;
// app.listen(PORT, () => {
//     console.log('Listening on port ' + PORT);
// })