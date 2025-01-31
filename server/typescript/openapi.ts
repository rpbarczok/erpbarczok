import type { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types.js'

import openApiJson from './openapi.json'  with { type: 'json' }

export const apiSpec = openApiJson as OpenAPIV3.DocumentV3
