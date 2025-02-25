import { expressjwt, GetVerificationKey } from 'express-jwt'
import jwks from 'jwks-rsa'
import { ProxyAgent } from 'proxy-agent'
import type {Algorithm} from 'jsonwebtoken'

const algorithms = process.env.ALGORITHM?.split(' ') || ['RS256']

const secret_prod = jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.JWKS_URI || `${process.env.IDP_SERVER}.well-known/jwks.json`,
    // requestAgent: Documentation hard to find: https://github.com/auth0/node-jwks-rsa/blob/master/EXAMPLES.md
    requestAgent: new ProxyAgent()
}) as GetVerificationKey

const secret_test = process.env.TEST_SECRET || 'secret'

export const  jwtCheck = expressjwt({ 
        secret: process.env.NODE_ENV==='test' ? secret_test : secret_prod, 
        audience: process.env.AUDIENCE, 
        issuer: process.env.IDP_SERVER,
        algorithms: algorithms as Algorithm[],  
        credentialsRequired: true })
