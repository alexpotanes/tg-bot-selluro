// Константы для расчета цен (в рублях)
export const PRICE_PER_ARTICLE = 600;
export const PRICE_PER_PHOTO = 40;

// Константа для индекса листа Google Sheets
export const GOOGLE_SHEET_INDEX = 3;

// Константы для rate limiting
export const RATE_LIMIT_WINDOW = 10000; // 10 секунд
export const MAX_REQUESTS_PER_WINDOW = 5; // максимум 5 запроса за 10 секунд

// Константы валидации
export const VALIDATION_RULES = {
    articles: {
        min: 1,
        max: 1000,
    },
    photo: {
        min: 0,
        max: 1000,
    },
    email: {
        regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    }
};

// Статусы членства в канале
export const MEMBER_STATUSES = ['creator', 'administrator', 'member'];
