export const CACHE_KEYS = {
    USER_LIST: 'users:list',
    USER_DETAIL: (identifier: string) => `user:${identifier}`,
    USER_EMAIL: (email: string) => `user:email:${email}`,
    USERS_FILTERED: (filters: string) => `users:filtered:${filters}`
    };
    