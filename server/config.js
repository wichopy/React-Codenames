import env from 'dotenv';

env.config({ silent: true })

export const {
  JWT_SECRET
} = process.env
