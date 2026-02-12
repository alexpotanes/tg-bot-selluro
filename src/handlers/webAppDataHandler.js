import { validateOrderData } from '../validators/orderValidator.js';
import { paymentService } from '../services/paymentService.js';

/**
 * Обработчик данных Web App (форма заказа)
 * @param {Object} bot - Экземпляр бота
 * @param {Object} msg - Сообщение от пользователя
 */
export async function handleWebAppData(bot, msg) {
    const chatId = String(msg.chat.id);

    try {
        const parsedData = JSON.parse(msg.web_app_data.data);

        // Сохраняем данные пользователя для последующей обработки платежа
        paymentService.saveUserOrder(chatId, parsedData);

        // Создаем счет на оплату
        await paymentService.createInvoice(bot, chatId, parsedData);

    } catch (error) {
        console.error('Ошибка обработки данных формы:', error);
        await bot.sendMessage(chatId, '❌ Произошла ошибка при обработке заказа. Пожалуйста, попробуйте еще раз.');
    }
}
