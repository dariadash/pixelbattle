const FALLBACK_SECRET = 'dev-only-insecure-secret-change-me';

export const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET ?? FALLBACK_SECRET;
    if (!process.env.JWT_SECRET) {
        console.warn('[auth] JWT_SECRET is not set, using insecure dev fallback. Set JWT_SECRET in .env');
    }
    return secret;
};
