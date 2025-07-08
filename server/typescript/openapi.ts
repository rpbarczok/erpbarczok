
/*
Copyright (c) 2025 Ralph Barczok
Portions Copyright (c) 2024 Pan Xuguang GmbH
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import type { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types.js'


const openIdConnectUrl = process.env.IDP_SERVER?.endsWith('/') ? `${process.env.IDP_SERVER}.well-known/openid-configuration` : `${String(process.env.IDP_SERVER)}/.well-known/openid-configuration`


export const apiSpec: OpenAPIV3.DocumentV3 = {
    'openapi': '3.0.3',
    'info': {
        'title': 'ERPBarczok',
        'description': 'The Description of the API of the ERPBarczok App',
        'version': '0.0.1'
    },
    'servers': [
        {
            'url': '/'
        }
    ],
    'tags': [
        {
            'name': 'Company'
        },
        {
            'name': 'CompanyType'
        },
        {
            'name': 'Field'
        },
        {
            'name': 'Country'
        },
        {
            'name': 'AddressType'
        },
        {
            'name': 'Address'
        }
    ],
    'paths': {
        '/companies/': {},
        '/companies/{id}': {},
        '/companies/{id}/addresses/': {},
        '/companies/{id}/addresses/{second_id}': {},
        '/company-types/': {},
        '/company-types/{id}': {},
        '/fields/': {},
        '/fields/{id}': {},
        '/address-types/': {},
        '/address-types/{id}': {},
        '/countries/': {},
        '/countries/{id}': {}
    },
    'components': {
        'parameters': {
            'id-in-path': {
                'name': 'id',
                'in': 'path',
                'description': 'Id of the entity',
                'required': true,
                'schema': {
                    'type': 'integer',
                    'minimum': 1,
                    'example': 1
                }
            },
            'second_id-in-path': {
                'name': 'second_id',
                'in': 'path',
                'description': 'second id in entity if needed',
                'required': true,
                'schema': {
                    'type': 'integer',
                    'minimum': 1,
                    'example': 1
                }
            },
            'if-match': {
                'name': 'if-match',
                'in': 'header',
                'description': 'etag in database must match etag specified in if-match as precondition',
                'required': true,
                'schema': {
                    '$ref': '#/components/schemas/etag'
                }
            }
        },
        'responses': {
            '201': {
                'description': 'Successful operation',
                'headers': {
                    'location': {
                        'description': 'Relative URI of the new entity',
                        'schema': {
                            '$ref': '#/components/schemas/location'
                        }
                    },
                    'etag': {
                        'description': 'Etag of the new entity',
                        'schema': {
                            '$ref': '#/components/schemas/etag'
                        }
                    },
                    'permissions': {
                        'description': 'Permission of the User',
                        'schema': {
                            '$ref': '#/components/schemas/permissions'
                        }
                    }
                }
            },
            '204_updated': {
                'description': 'Successful operation',
                'headers': {
                    'location': {
                        'description': 'Relative URI of the updated entity',
                        'schema': {
                            '$ref': '#/components/schemas/location'
                        }
                    },
                    'etag': {
                        'description': 'Etag of the updated entity',
                        'schema': {
                            '$ref': '#/components/schemas/etag'
                        }
                    },
                    'permissions': {
                        'description': 'Permission of the User',
                        'schema': {
                            '$ref': '#/components/schemas/permissions'
                        }
                    }
                }
            },
            '204_success': {
                'description': 'Successful operation',
                'headers': {
                    'permissions': {
                        'description': 'Permission of the User',
                        'schema': {
                            '$ref': '#/components/schemas/permissions'
                        }
                    }
                }
            },
            '400_validation_error': {
                'description': 'Bad request.',
                'content': {
                    'application/json': {
                        'schema': {
                            '$ref': '#/components/schemas/error'
                        },
                        'examples': {
                            '400': {
                                '$ref': '#/components/examples/error400'
                            }
                        }
                    }
                }
            },
            '401_authorization_error': {
                'description': 'Unauthorized.',
                'content': {
                    'application/json': {
                        'schema': {
                            '$ref': '#/components/schemas/error'
                        },
                        'examples': {
                            '401': {
                                '$ref': '#/components/examples/error401'
                            }
                        }
                    }
                }
            },
            '404_not_found_error': {
                'description': 'not found',
                'content': {
                    'application/json': {
                        'schema': {
                            '$ref': '#/components/schemas/error'
                        },
                        'examples': {
                            '404': {
                                '$ref': '#/components/examples/error404'
                            }
                        }
                    }
                }
            },
            '409_conflict_error': {
                'description': 'Conflict: Used when you try to delete something, that is still referenced in der DB',
                'content': {
                    'application/json': {
                        'schema': {
                            '$ref': '#/components/schemas/error'
                        },
                        'examples': {
                            '409': {
                                '$ref': '#/components/examples/error409'
                            }
                        }
                    }
                }
            },
            '412_precondition_error': {
                'description': 'precondition failed',
                'content': {
                    'application/json': {
                        'schema': {
                            '$ref': '#/components/schemas/error'
                        },
                        'examples': {
                            '412': {
                                '$ref': '#/components/examples/error412'
                            }
                        }
                    }
                }
            }
        },
        'schemas': {
            'location': {
                'type': 'string',
                'format': 'uri-reference',
                'example': 'location/1'
            },
            'etag': {
                'type': 'string',
                'example': '656da9646b5a65673e4a1f504ac3d44232e2da0d939413619ef0fd33850f818a'
            },
            'permissions': {
                'type': 'string',
                'example': 'user admin'
            },
            'meta': {
                'type': 'object',
                'required': [
                    'location',
                    'etag'
                ],
                'additionalProperties': false,
                'properties': {
                    'location': {
                        '$ref': '#/components/schemas/location'
                    },
                    'etag': {
                        '$ref': '#/components/schemas/etag'
                    }
                }
            },
            'companyType': {
                'type': 'object',
                'required': [
                    'name'
                ],
                'additionalProperties': false,
                'properties': {
                    'name': {
                        'type': 'string',
                        'example': 'Kunde',
                        'maxLength': 32
                    }
                }
            },
            'addressType': {
                'type': 'object',
                'required': [
                    'name'
                ],
                'additionalProperties': false,
                'properties': {
                    'name': {
                        'type': 'string',
                        'example': 'Unternehmensadresse',
                        'maxLength': 32
                    }
                }
            },
            'field': {
                'type': 'object',
                'required': [
                    'name'
                ],
                'additionalProperties': false,
                'properties': {
                    'name': {
                        'type': 'string',
                        'example': 'Lebensmittel',
                        'maxLength': 32
                    }
                }
            },
            'company': {
                'type': 'object',
                'required': [
                    'name',
                    'companyType'
                ],
                'additionalProperties': false,
                'properties': {
                    'name': {
                        'type': 'string',
                        'example': 'Firma A'
                    },
                    'abbr': {
                        'type': 'string',
                        'example': 'FRA',
                        'maxLength': 3
                    },
                    'www': {
                        'type': 'string',
                        'example': 'www.example.org'
                    },
                    'companyType': {
                        'type': 'string',
                        'example': 'Kunde'
                    }
                }
            },
            'country': {
                'type': 'object',
                'required': [
                    'name',
                    'abbr',
                    'isEU'
                ],
                'additionalProperties': false,
                'properties': {
                    'name': {
                        'type': 'string',
                        'example': 'Germany'
                    },
                    'abbr': {
                        'type': 'string',
                        'example': 'DEU',
                        'maxLength': 3
                    },
                    'isEU': {
                        'type': 'boolean',
                        'example': true
                    }
                }
            },
            'address': {
                'type': 'object',
                'required': [
                    'street',
                    'po',
                    'city',
                    'addressType',
                    'country'
                ],
                'additionalProperties': false,
                'properties': {
                    'street': {
                        'type': 'string',
                        'example': 'Poststraße 1'
                    },
                    'po': {
                        'type': 'string',
                        'example': '11111',
                    },
                    'city': {
                        'type': 'string',
                        'example': 'Berlin'
                    },
                    'country': {
                        'type': 'string',
                        'example': 'Deutschland'
                    },
                    'addressType': {
                        'type': 'string',
                        'example': 'Unternehmensadresse'
                    }
                }
            },
            'error': {
                'required': [
                    'message',
                    'status'
                ],
                'additionalProperties': false,
                'properties': {
                    'status': {
                        'type': 'integer'
                    },
                    'message': {
                        'type': 'string'
                    },
                    'errors': {
                        'type': 'array',
                        'items': {}
                    }
                }
            }
        },
        'securitySchemes': {
            'openId': {
                'type': 'openIdConnect',
                'openIdConnectUrl': openIdConnectUrl
            }
        },
        'examples': {
            'company': {
                'value': {
                    'name': 'Firma A',
                    'abbr': 'FRA',
                    'www': 'www.example.de',
                    'companyType': 'Kunde'
                }
            },
            'address': {
                'value': {
                    'street': 'Poststraße 1',
                    'po': '1002',
                    'city': 'Berlin',
                    'addressType': 'Unternehmensadresse',
                    'country': 'Deutschland'
                }
            },
            'companyType': {
                'value': {
                    'name': 'Kunde'
                }
            },
            'addressType': {
                'value': {
                    'name': 'Unternehmensadresse'
                }
            },
            'field': {
                'value': {
                    'name': 'Lebensmittel'
                }
            },
            'country': {
                'value': {
                    'name': 'Germany',
                    'abbr': 'DEU',
                    'inEU': true
                }
            },
            'error400': {
                'value': {
                    'status': 400,
                    'message': 'Bad request.'
                }
            },
            'error401': {
                'value': {
                    'status': 401,
                    'message': 'Unauthorized.'
                }
            },
            'error404': {
                'value': {
                    'status': 404,
                    'message': 'Not found.'
                }
            },
            'error409': {
                'value': {
                    'status': 409,
                    'message': 'Conflict.'
                }
            },
            'error412': {
                'value': {
                    'status': 412,
                    'message': 'Precondition failed.'
                }
            },
            'error500': {
                'value': {
                    'status': 500,
                    'message': 'Internal server error.'
                }
            }
        }
    }
}