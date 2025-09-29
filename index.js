import TgApi from 'node-telegram-bot-api';
import {GoogleSpreadsheet} from "google-spreadsheet";
import {JWT} from 'google-auth-library';
import express from 'express';
import cors from 'cors';

const BOT_TOKEN = '7791484578:AAHajxfErWPiaS5ZgYisGD1V98h-RumqXkY';

const GOOGLE_TABLE_ID="1_44kRqwJcY2N3SNeM5xJb-FtSF-zMaftAmvQeukf0Ak"; //"1p7yNo-lUOHlEYBISuASlvxoExirmKFrKI9MfgRO-oz8";
const GOOGLE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDT5lqstNyYvHin\nRmCuZd8TqIKnC0VGNYJ8S+XLe1jgElB4UXgUm1ODdqhXgAV6bYVFvhI6YYMMmWZN\nSCj9NumGlHhhtfNMjCt/6Mppaos9b4YUkF8+5JwgDy1JMFTvgOvahkoDG9h3LmPh\nkH6Oe6TVh71fnleRvUtLUneMONxAKi38NuUi/CsX1XHv3fUQY7F3gvGniri3YCDR\norE1LbESi2fhuTAKDXJF8OeA0to8LHiHwWrXs9Lmp/2mmrPzrbwK0YukvG2+rFZK\nX4QhjgxfjvT8zf4xCZdF1awfIT7IzbEcRAPJRf2boXhG3gLRXYzDwYUhAEFLVM7t\nKoy+RdipAgMBAAECggEAHlaBru5qEvgQ8ioSV4XATYk3w4DKl0W7+93F9b8gN1yH\n5uILJjAi4dSQP47VufSKOzT+WRty7s/bpL7rF23QO3NwVNT/E3uSEssah8M4UkBw\nWutcp52FeNWTb0IbNvsnSW8mk5FeCZo7tKTCadXsAKJhi5oZAYWvjQYulYXiitD8\nOaDgTmz+PAoIL2n92PKdstC85z6qs2Q/Iz8e9a44C5jT+d5KvqivE0Z3/+3GXJL6\nHsflb8fAeBmA/oRB6QACf4hFm2we3LmUEeWZ/JQx1Zw4Uz7Ys1+IQ9WIVOIy/JPN\nOsd4tML4VL3B4LGJ54oPwwMxWLPJ3BoGazKvMhJ2nQKBgQD95JzMjf3dJo79ABkm\n4NEF5s5y8QOB26qbzklDjhdGwrMSypKhxS0Kz3Vap8OO7BbAhpwYEpiShO3sjKLF\n1BGlsfuYLQIX6hbQpdwevCzQHUlyLSgbhpfMFLq+3QVSvfpw1onK5aFYAxJS1mbV\nSr5m791VDdFWhECMJmGIrtg7ewKBgQDVqIdMr15E9yJF3E+Wv2X2XVGLukcZjeX1\n3vk4s3gm31Tyfx7KYCzw+OHh9hFxEEJ/x6/A1wbIOtJKuS/8YrqhjzDGDJfsVGwH\nlJa3RL5zkU9crvwvKZQnQ2P8t3C/52PNv4dTUgpiUq8bAThF+DsJbHYW7CoSlkyy\nKyF1NgshKwKBgQCFwVCRuyRIw62Ev+6AOuQjdcrBZxNv8CfbWTvjqRG+J4hrl+jT\n7KqkDVNH5SXzP5Fk8AV/8RwL5JfrjNOb4PNDFZb0PpHhw2MtnJNwZbY+FY/B5ORC\nTA/gZfNT5eCODKPJmlyRVZRAZ63ZkjYum+ffFvLFgjgMmjPfIcE0XthvzQKBgQDQ\n9eJdvaYVDR8X9EBizw6JxPrcDXM8KuudbFWSfvQkEIikIm+avjU1+DPzKxYj3iMr\nlcDueV7Itb62Fig4Ttb463JoQCjVmjuNrmU5GKKrpJJZs0oxVhjvzZkcsMw047lY\noNlZRAOj5focDzVaOUyECu/zu0Xqp9Sa7FPsrs5zwQKBgQDyEBukOciYU7enc5Wq\njPe5Ou0H2Po47RUR5lpIkVtk000ipMo4qAEsmnqrVN20AS+MXZ/07IXBmI5HHKJ4\nZ/DTBaXccvBTTH5LJNnjDoTvLin99VI9pbzYG+rSc16spagfsubAUIMcfg0dM+jJ\nn23ZMxFPMGifpLL513TT8xWtDA==\n-----END PRIVATE KEY-----\n";
const GOOGLE_CLIENT_EMAIL = "sellurobot@sellurobot.iam.gserviceaccount.com";
const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file',
];

const WEB_PORTFOLIO = 'https://stone.wfolio.pro/disk/neroset-portfolio-r975cs';
const WEB_APP_URL = 'https://famous-sable-041562.netlify.app';

const startText = `👋<b>Привет! Вы в Контент-боте для селлеров.</b>

<b>Как это устроено:</b>
  1. Вы оплачиваете подписку — 2500 ₽ мес. (для первых 200 пользователей — <b>1500 ₽ навсегда</b>).
  2. Подписка даёт доступ к контенту <b>по себестоимости</b> в нашей нейросети.
  3. <b>После этого можно заказывать:</b>
    • Артикул по цене — 600 ₽
    • Фото по цене — 40 ₽/шт.
  4. <b>Для примера:</b> 10 артикулов × 10 фото = 10 000 ₽ (в продакшене это ~40-70 000 ₽).

<b>Выгоды:</b>
    • <b>Мы в ручную контролируем процесс и результат</b>, чтобы не было «трэша» как в других ботах.
    • Экономия в 4 - 7раз по сравнению с продакшенами и студиями.
    • Возможность быстро тестировать разные карточки.
    • Подходит для 95% товарки (одежда, мебель, аксессуары
<b>Что дальше? 👇</b>`;
const depositText = `💳 Внесение депозита

 Для того чтобы начать пользоваться ботом, нужно внести депозит.
 Депозит формируется исходя из того, сколько артикулов и фотографий вам нужно.

👉 Давайте рассчитаем ваши лимиты:
 • 1 артикул = 600 ₽
 • 1 фото = 40 ₽

 Введите количество артикулов и количество фото на каждый артикул в калькулятор, и система автоматически посчитает итоговую сумму депозита.

 После расчёта вы сможете сразу внести депозит и получить доступ к генерации контента по себестоимости`;

const buttonsStart = {
    reply_markup: {
        inline_keyboard: [
            [{text: 'Посмотреть примеры работ', web_app: {url: WEB_PORTFOLIO}},{text: 'Оформить подписку и начать', callback_data: 'subscribe'}],
        ]
    }
};
const buttonsSub = {
    reply_markup: {
        inline_keyboard: [
            [{text: 'Внести депозит', callback_data: 'deposit'}, {text: 'Поддержка', url: 'https://t.me/Auracaller'}],
        ]
    }
};
const buttonsDeposit = {
    reply_markup: {
        keyboard: [
            [{text: '🔘  Открыть калькулятор', web_app: {url: WEB_APP_URL + '/form'}}],
        ]
    }
};
const buttonsTask = {
    reply_markup: {
        keyboard: [
            [
                {text: 'Заполнить тз', web_app: {url: 'https://docs.google.com/forms/d/e/1FAIpQLSdw5pbOVkshGv5P5bje2SxRcZSwmlkqfrJGilUHZrZ00VnT4A/viewform'}},
                {text: 'Поддержка', callback_data: 'help'}
            ]
        ]
    }
};
let dataTask = {};

const bot = new TgApi(BOT_TOKEN, { polling: true });
const app = express();
app.use(express.json());
app.use(cors());

const serviceAccountAuth = new JWT({
    email: GOOGLE_CLIENT_EMAIL,
    key: GOOGLE_PRIVATE_KEY,
    scopes: SCOPES,
});
const doc = new GoogleSpreadsheet(GOOGLE_TABLE_ID, serviceAccountAuth);

bot.setMyCommands([
    { command: '/start', description: 'Начальное приветствие' }
]);

const getJsonData = (list) => {
    const headers = list[0];
    return list.slice(1).map(row => {
        const obj = {};
        headers.forEach((header, index) => {
            obj[header] = row[index];
        });
        return obj;
    });
};

const start = async () => {
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = String(msg.chat.id);

        if (text === '/start') {
            await doc.loadInfo();
            const sheet1 = doc.sheetsByIndex[2];
            const currentDate = new Date(); // Текущая дата
            let isSubscribe = false;

            const list = await sheet1.getCellsInRange('A:F', { majorDimension: 'ROWS', valueRenderOption: 'FORMATTED_VALUE' } ); // Gets the range containing all data

            const jsonData = getJsonData(list);

            for(let i = 0; i < jsonData.length; i++) {
                if(jsonData[i]["ID пользователя"] === chatId) {
                    const initialDate = new Date(jsonData[i]["Дата начала подписки"]);
                    const diffMilliseconds = currentDate.getTime() - initialDate.getTime();
                    const millisecondsPerDay = 1000 * 60 * 60 * 24;
                    const daysPassed = diffMilliseconds / millisecondsPerDay;
                    isSubscribe = daysPassed < 30;
                }
            }

            if (isSubscribe) {
                await bot.sendMessage(
                  chatId,
                  `По кнопке ниже можете подсчитать стоимость, а затем оплатить услугу`,
                  buttonsSub
                );
            } else {
                await bot.sendMessage(chatId, startText, { parse_mode: 'HTML', ...buttonsStart } );
            }
        }

        if (msg?.web_app_data?.data) {
            try {
                dataTask = JSON.parse(msg.web_app_data.data);
                const { articles, photo } = dataTask;
                const price = (articles * 600) + ((articles * photo) * 40);

                await bot.sendInvoice(
                  chatId,
                  'Ваш заказ',
                  `Количество артикулов: ${articles}                                                           Количество фото на один артикул: ${photo}`,
                  'send-invoice',
                  '390540012:LIVE:78875', //'381764678:TEST:143534',
                  'RUB',
                  [{label: 'Заказ', amount: price*100 }],
                  {
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

        if (text === 'subscribe') {
            return bot.sendInvoice(
              chatId,
              'Подписка на сервис',
              "Для того чтобы начать пользоваться ботом необходимо оплатить ежемесяную подписку 1500р. Оплачивая вы соглашаетесь с офертой и политикой обарботки персональных данных",
              'subscribe-invoice',
              '390540012:LIVE:78875', //'381764678:TEST:143534',
              'RUB',
              [{label: 'Подписка', amount: 150000}],
              {save_payment_method: true}
            );
        }
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
        const name = `${data.chat.first_name} ${data.chat.last_name}`;

        await doc.loadInfo();

        if (targetInvoice === 'subscribe-invoice') {
            const sheet = doc.sheetsByIndex[2]
            await sheet.addRow({
                "ID пользователя": chatId,
                "ФИО": name,
                "TgID": data.chat.username,
                "сумма": '1500',
                "Дата начала подписки": new Date()
            });

            return bot.sendMessage(
              chatId,
              `По кнопке ниже можете подсчитать стоимость, а затем оплатить услугу`,
              buttonsSub
            );
        }
        if (targetInvoice === 'send-invoice') {
            const {
                articles,
                photo,
                fashion,
                product,
                references,
                hair,
                race,
                productImg,
                acceptResult,
                acceptQuantity,
            } = dataTask;
            const price = (articles * 600) + ((articles * photo) * 40);

            await doc.loadInfo(); // loads document properties and worksheets
            const sheet = doc.sheetsByIndex[3]

            await sheet.addRow({
                "Отметка времени": new Date(),
                "ID ТЗ": chatId,
                "ФИО": name,
                "Кол-во артикулов": articles ,
                "Кол-во фото": photo,
                "Цена": price,
                "Есть ли пожелания по фону или образу?": fashion,
                "Какой товар?": product,
                "Если есть ссылки на референсы - прикрепите.": references,
                "волосы модели": hair,
                "расса модели": race,
                "Загрузить фото  товара": productImg,
                "Я подтверждаю что мои фото сделаны качественно, текстуру видно хорошо, фон однородный.  Чем лучше исходник - тем точнее результат.": acceptResult,
                "Я осведомлен с тем, что фото и артикулы с большим кол-вом деталей, сложными принтами- не будут переданы в точности.": acceptQuantity
            });

            return bot.sendMessage(
              chatId,
              `По кнопке ниже можете подсчитать стоимость, заполнить ТЗ, а затем оплатить услугу`,
              buttonsDeposit
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