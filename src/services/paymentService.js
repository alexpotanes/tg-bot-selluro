import { config } from '../config/env.js';
import { calculatePrice, rublesToKopecks, kopecksToRubles } from './priceCalculator.js';

/**
 * Класс для управления платежами и данными пользователей
 */
export class PaymentService {
    constructor() {
        // Хранилище данных пользователей (по chatId)
        this.userDataMap = new Map();
    }

    /**
     * Сохранение данных заказа пользователя
     * @param {string} chatId - ID чата
     * @param {Object} orderData - Данные заказа
     */
    saveUserOrder(chatId, orderData) {
        this.userDataMap.set(chatId, orderData);
    }

    /**
     * Получение данных заказа пользователя
     * @param {string} chatId - ID чата
     * @returns {Object|null} Данные заказа или null
     */
    getUserOrder(chatId) {
        return this.userDataMap.get(chatId) || null;
    }

    /**
     * Удаление данных заказа пользователя
     * @param {string} chatId - ID чата
     */
    deleteUserOrder(chatId) {
        this.userDataMap.delete(chatId);
    }

    /**
     * Создание счета на оплату
     * @param {Object} bot - Экземпляр бота
     * @param {string} chatId - ID чата
     * @param {Object} orderData - Данные заказа
     */
    async createInvoice(bot, chatId, orderData) {
        const { articles, photo, email } = orderData;
        const price = calculatePrice(articles, photo);
        const priceInKopecks = rublesToKopecks(price);

        await bot.sendInvoice(
            chatId,
            'Ваш заказ',
            `Количество артикулов: ${articles}\nКоличество фото на один артикул: ${photo}`,
            'send-invoice',
            config.payment.token,
            'RUB',
            [{ label: 'Заказ', amount: priceInKopecks }],
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
    }

    /**
     * Валидация платежа перед подтверждением
     * @param {Object} preCheckoutQuery - Данные pre-checkout query
     * @returns {Object} Результат валидации { valid: boolean, error?: string }
     */
    validatePayment(preCheckoutQuery) {
        const chatId = String(preCheckoutQuery.from.id);
        const userData = this.getUserOrder(chatId);

        // Проверяем, есть ли данные пользователя
        if (!userData) {
            return {
                valid: false,
                error: 'Данные заказа не найдены. Пожалуйста, создайте заказ заново.'
            };
        }

        // Проверяем сумму платежа
        const expectedPrice = calculatePrice(userData.articles, userData.photo);
        const actualPrice = kopecksToRubles(preCheckoutQuery.total_amount);

        if (Math.abs(expectedPrice - actualPrice) > 0.01) {
            console.error(`Несовпадение суммы платежа для ${chatId}: ожидалось ${expectedPrice}, получено ${actualPrice}`);
            return {
                valid: false,
                error: 'Ошибка суммы платежа. Пожалуйста, создайте заказ заново.'
            };
        }

        return { valid: true };
    }
}

// Создаем singleton instance
export const paymentService = new PaymentService();
