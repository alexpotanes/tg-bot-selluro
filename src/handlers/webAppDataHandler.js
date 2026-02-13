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
        const rawData = JSON.parse(msg.web_app_data.data);
        const parsedData = {
            articles: Number(rawData.articles),
            photo: Number(rawData.photo),
            email: rawData.email,
            fashion: rawData.fashion || '',
            product: rawData.product || '',
            references: rawData.references || '',
            hair: rawData.hair || '',
            race: rawData.race || '',
            productImg: rawData.productImg || '',
            acceptResult: rawData.acceptResult || '',
            acceptQuantity: rawData.acceptQuantity || '',
        };

        // Валидация входных данных
        const validationErrors = validateOrderData(parsedData);
        if (validationErrors.length > 0) {
            await bot.sendMessage(chatId, `❌ Ошибка валидации:\n${validationErrors.join('\n')}`);
            return;
        }

        // Сохраняем данные пользователя для последующей обработки платежа
        paymentService.saveUserOrder(chatId, parsedData);

        // Создаем счет на оплату
        await paymentService.createInvoice(bot, chatId, parsedData);

    } catch (error) {
        console.error('Ошибка обработки данных формы:', error);
        await bot.sendMessage(chatId, '❌ Произошла ошибка при обработке заказа. Пожалуйста, попробуйте еще раз.');
    }
}
