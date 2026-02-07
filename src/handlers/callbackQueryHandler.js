import { buttonsDeposit, buttonsSub } from '../../buttons.js';
import { depositText } from '../../descriptions.js';

/**
 * Обработчик callback query (нажатия на inline кнопки)
 * @param {Object} bot - Экземпляр бота
 * @param {Object} msg - Callback query от пользователя
 */
export async function handleCallbackQuery(bot, msg) {
    const text = msg.data;
    const chatId = msg.message.chat.id;

    try {
        if (text === 'deposit') {
            await bot.sendMessage(chatId, depositText, buttonsDeposit);
        } else if (text === 'buttonsDeposit') {
            await bot.sendMessage(chatId, depositText, buttonsSub);
        }
    } catch (error) {
        console.error('Ошибка в handleCallbackQuery:', error);
    }
}
