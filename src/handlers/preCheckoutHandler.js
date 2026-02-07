import { paymentService } from '../services/paymentService.js';

/**
 * Обработчик pre-checkout query (валидация перед оплатой)
 * @param {Object} bot - Экземпляр бота
 * @param {Object} data - Pre-checkout query данные
 */
export async function handlePreCheckout(bot, data) {
    try {
        const validation = paymentService.validatePayment(data);

        if (!validation.valid) {
            await bot.answerPreCheckoutQuery(data.id, false, {
                error_message: validation.error
            });
            return;
        }

        // Все проверки пройдены
        await bot.answerPreCheckoutQuery(data.id, true);
    } catch (error) {
        console.error('Ошибка при валидации платежа:', error);
        await bot.answerPreCheckoutQuery(data.id, false, {
            error_message: 'Ошибка обработки платежа. Попробуйте позже.'
        });
    }
}
