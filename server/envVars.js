import env from 'node-env-file'
env('./.env');

export const SECRET = process.env.SECRET
