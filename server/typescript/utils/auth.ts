import { expressjwt, GetVerificationKey } from 'express-jwt'
import jwks from 'jwks-rsa'

const secret = jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.JWKS_URI || `https://${process.env.IDP_SERVER}/.well-known/jwks.json`
}) as GetVerificationKey

export const  jwtCheck = expressjwt({ 
        secret: secret, 
        audience: process.env.AUDIENCE, 
        issuer: process.env.IDP_SERVER, 
        algorithms: ['RS256'], 
        credentialsRequired: false })
