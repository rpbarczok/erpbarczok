import crypto from 'crypto'

export const sha256 = (payload: string) => crypto.createHash('sha256').update(payload).digest('hex')