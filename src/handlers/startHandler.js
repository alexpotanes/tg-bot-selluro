import { checkSubscription } from '../middleware/subscriptionChecker.js';
import { buttonsSub, buttonsStart } from '../../buttons.js';
import { startText } from '../../descriptions.js';

/**
 * Обработчик команды /start
 * @param {Object} bot - Экземпляр бота
 * @param {Object} msg - Сообщение от пользователя
 */
export async function handleStart(bot, msg) {
    const chatId = String(msg.chat.id);
    const userId = String(msg.from.id);

    try {
        const isSubscribed = await checkSubscription(bot, userId);

        if (isSubscribed) {
            await bot.sendMessage(
                chatId,
                `По кнопке ниже можете подсчитать стоимость, заполнить ТЗ, а затем оплатить услугу`,
                buttonsSub
            );
        } else {
            await bot.sendMessage(chatId, startText, { parse_mode: 'HTML', ...buttonsStart });
        }
    } catch (error) {
        console.error('Ошибка в handleStart:', error);
        await bot.sendMessage(chatId, startText, { parse_mode: 'HTML', ...buttonsStart });
    }
}
