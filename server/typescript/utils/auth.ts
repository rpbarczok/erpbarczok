import { expressjwt, GetVerificationKey } from 'express-jwt'
import jwks from 'jwks-rsa'

const secret = jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.IDP_SERVER}/.well-known/jwks.json`
}) as GetVerificationKey

export const  jwtCheck = expressjwt({ 
        secret: secret, 
        audience: process.env.AUDIENCE, 
        issuer: `https://${process.env.IDP_SERVER}/`, 
        algorithms: ['RS256'], 
        credentialsRequired: true })
