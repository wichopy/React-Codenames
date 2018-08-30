import env from '../../../Library/Caches/typescript/2.9/node_modules/@types/dotenv';

env.config({ silent: true })

export const {
  JWT_SECRET
} = process.env
