/**
 * Telegram Bot - Точка входа
 * Модульная архитектура с разделением ответственности
 */

import TgApi from 'node-telegram-bot-api';
import { config } from './src/config/env.js';
import { rateLimiter } from './src/middleware/rateLimiter.js';
import { googleSheetsService } from './src/services/googleSheetsService.js';

// Импорт обработчиков
import { handleStart } from './src/handlers/startHandler.js';
import { handleWebAppData } from './src/handlers/webAppDataHandler.js';
import { handleCallbackQuery } from './src/handlers/callbackQueryHandler.js';
import { handlePreCheckout } from './src/handlers/preCheckoutHandler.js';
import { handleSuccessfulPayment } from './src/handlers/successfulPaymentHandler.js';

// Инициализация бота
const bot = new TgApi(config.bot.token, { polling: true });

// Установка команд бота
bot.setMyCommands([
    { command: '/start', description: 'Начальное приветствие' }
]);

/**
 * Инициализация сервисов
 */
async function initializeServices() {
    try {
        console.log('🚀 Инициализация сервисов...');
        await googleSheetsService.initialize();
        console.log('✅ Все сервисы инициализированы');
    } catch (error) {
        console.error('❌ Ошибка инициализации сервисов:', error);
        process.exit(1);
    }
}

/**
 * Обработчик сообщений
 */
bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = String(msg.chat.id);
    const userId = String(msg.from.id);

    // Проверка rate limiting для всех сообщений
    if (!rateLimiter.checkLimit(userId)) {
        console.warn(`Rate limit exceeded for user ${userId}`);
        await bot.sendMessage(chatId, '⏱ Слишком много запросов. Пожалуйста, подождите немного.');
        return;
    }

    // Обработка команды /start
    if (text === '/start') {
        await handleStart(bot, msg);
        return;
    }

    // Обработка данных Web App
    if (msg?.web_app_data?.data) {
        await handleWebAppData(bot, msg);
        return;
    }
});

/**
 * Обработчик callback query (inline кнопки)
 */
bot.on('callback_query', async (msg) => {
    await handleCallbackQuery(bot, msg);
});

/**
 * Обработчик pre-checkout query (валидация перед оплатой)
 */
bot.on('pre_checkout_query', async (data) => {
    await handlePreCheckout(bot, data);
});

/**
 * Обработчик успешного платежа
 */
bot.on('successful_payment', async (data) => {
    await handleSuccessfulPayment(bot, data);
});

/**
 * Обработчик ошибок polling
 */
bot.on('polling_error', (error) => {
    console.error('❌ Ошибка polling:', error);
});

/**
 * Запуск бота
 */
async function start() {
    try {
        await initializeServices();
        console.log('✅ Бот запущен успешно');
    } catch (error) {
        console.error('❌ Ошибка запуска бота:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Остановка бота...');
    bot.stopPolling();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Остановка бота...');
    bot.stopPolling();
    process.exit(0);
});

// Запуск
start();
