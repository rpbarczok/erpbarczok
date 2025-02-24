import { expressjwt, GetVerificationKey } from 'express-jwt'
import jwks from 'jwks-rsa'
import { ProxyAgent } from 'proxy-agent'

const secret = jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.JWKS_URI || `${process.env.IDP_SERVER}.well-known/jwks.json`,
    requestAgent: new ProxyAgent()
}) as GetVerificationKey

export const  jwtCheck = expressjwt({ 
        secret: secret, 
        audience: process.env.AUDIENCE, 
        issuer: process.env.IDP_SERVER, 
        algorithms: ['RS256'], 
        credentialsRequired: false })
