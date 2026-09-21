const FALLBACK_SECRET = 'dev-only-insecure-secret-change-me';

if (!process.env.JWT_SECRET) {
    // eslint-disable-next-line no-console
    console.warn('[auth] JWT_SECRET is not set, using insecure dev fallback. Set JWT_SECRET in .env');
}

export const getJwtSecret = () => process.env.JWT_SECRET ?? FALLBACK_SECRET;
