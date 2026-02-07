import { paymentService } from '../services/paymentService.js';
import { googleSheetsService } from '../services/googleSheetsService.js';
import { buttonsSub } from '../../buttons.js';

/**
 * Обработчик успешного платежа
 * @param {Object} bot - Экземпляр бота
 * @param {Object} data - Данные успешного платежа
 */
export async function handleSuccessfulPayment(bot, data) {
    const chatId = String(data.chat.id);

    try {
        const targetInvoice = data.successful_payment.invoice_payload;
        const username = data.chat.username;
        const name = `${data.chat.first_name} ${data.chat.last_name ? data.chat.last_name : ''}`;

        // Получаем данные пользователя
        const userData = paymentService.getUserOrder(chatId);

        if (!userData) {
            console.error(`Данные заказа не найдены для пользователя ${chatId} при обработке платежа`);
            await bot.sendMessage(chatId, '❌ Ошибка: данные заказа не найдены. Пожалуйста, свяжитесь с поддержкой.');
            return;
        }

        if (targetInvoice === 'send-invoice') {
            // Сохраняем в Google Sheets
            await googleSheetsService.saveOrder(userData, chatId, name, username);

            // Удаляем данные пользователя после успешной обработки
            paymentService.deleteUserOrder(chatId);

            await bot.sendMessage(
                chatId,
                `✅ Оплата прошла успешно! Ваш заказ принят.\n\nПо кнопке ниже можете подсчитать стоимость, заполнить ТЗ, а затем оплатить услугу`,
                buttonsSub
            );
        }
    } catch (error) {
        console.error('Ошибка обработки успешного платежа:', error);
        await bot.sendMessage(chatId, '❌ Произошла ошибка при обработке платежа. Пожалуйста, свяжитесь с поддержкой.');
    }
}
