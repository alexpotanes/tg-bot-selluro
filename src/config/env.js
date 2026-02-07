import dotenv from 'dotenv';

dotenv.config();

// Валидация обязательных переменных окружения при старте
const requiredEnvVars = [
    'BOT_TOKEN',
    'GOOGLE_PRIVATE_KEY',
    'PAYMENT_TOKEN',
    'CHANNEL_ID_1',
    'CHANNEL_ID_2'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.error(`❌ ОШИБКА: Отсутствуют обязательные переменные окружения: ${missingVars.join(', ')}`);
    console.error('Пожалуйста, проверьте файл .env');
    process.exit(1);
}

// Экспорт переменных окружения
export const config = {
    bot: {
        token: process.env.BOT_TOKEN,
    },
    google: {
        privateKey: process.env.GOOGLE_PRIVATE_KEY.split(String.raw`\n`).join('\n'),
    },
    payment: {
        token: process.env.PAYMENT_TOKEN,
    },
    channels: {
        id1: process.env.CHANNEL_ID_1,
        id2: process.env.CHANNEL_ID_2,
    }
};
