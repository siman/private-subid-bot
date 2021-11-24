import * as dotenv from 'dotenv'

dotenv.config()

export const TOKEN = process.env.BOT_TOKEN || ''

export const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001'

export const adminsArray = process.env.ADMIN_USER_IDS?.split(',') || []

