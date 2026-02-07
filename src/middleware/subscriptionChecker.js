import { config } from '../config/env.js';
import { MEMBER_STATUSES } from '../config/constants.js';

/**
 * Проверка подписки пользователя на каналы
 * @param {Object} bot - Экземпляр бота
 * @param {string} userId - ID пользователя
 * @returns {Promise<boolean>} true если пользователь подписан хотя бы на один канал
 */
export async function checkSubscription(bot, userId) {
    const channels = [config.channels.id1, config.channels.id2];

    try {
        // Параллельная проверка членства в обоих каналах
        const membershipChecks = await Promise.all(
            channels.map(channelId => bot.getChatMember(channelId, userId))
        );

        // Проверяем, является ли пользователь членом хотя бы одного канала
        return membershipChecks.some(chatMember =>
            MEMBER_STATUSES.includes(chatMember.status)
        );
    } catch (error) {
        console.error('Ошибка проверки подписки:', error);
        // В случае ошибки возвращаем false (безопасный fallback)
        return false;
    }
}
