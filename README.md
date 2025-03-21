# ERPBarczok

ERPBarczok is a small training app I implemented to exercise the areas of full stack development. It is a demo version for a erp software for a small enterprise.

The use case of the software:
* daily use in the office
* remote use from china, i.e. connection with high rate of package loss
* remote use from areas with slow internet connection

I decided to use the following architecture:
* Frontend as Single Page App (SPA) installable as Progressive Web App (PWA)
* Backend API

I used following technologies:
* Express Backend (TypeScript, OpenApi, Swagger-UI, Mocha)
* React Frontend (TypeScript)

The software is provided on https://github.com/rpbarczok/panda2.

A docker image is provided on https://github.com/rpbarczok/panda2/pkgs/container/erpbarczok. The tag 'latest' provides the latest running build. It is created when merging a Pull Request into the main branch via GitHub Actions.

The application needs a PostgreSQL database to work.

The implementation of Auth works with Auth0 and EntraID. For AuthN the scopes "openid", "email" and "profile" are needed. The  

Environment Variables:

Variable | Description | required? | Default Value | Example
-- | -- | -- | -- | --
NODE_ENV | describes the environment | yes | | 'production', 'development'
DB_NAME | Name of the used database | yes | | 'erpbarczok_db'
DB_USER | Name of the database user with access to the database | yes | | 'erpbarczok_app'
DB_PASSWORD | Password of the database user for to the database | yes | | 'test123!|
DB_HOST | Host of the database | yes | | 'localhost'
DB_PORT | Port of the database | yes | | 5432
CLIENT_ID | Client id of the app in the authenticator | yes | |
IDP_SERVER | URI of the IDP Server | yes | | 'https://dev-example.eu.auth0.com/'
AUDIENCE | Audience of the app as given by the authentication provider | yes | | 
SCOPE | Scope needed to use the the application | no | 'openid email profile admin user' | 
ALGORITHM | Algorithm used in the authentication process | no | 'RS256' | 
CLIENT_ID_SWAGGER | client id for the swagger ui | no | CLIENT_ID |
JWKS_URI | URI of the JWKS key if different from the standard | no | IDP_SERVER + '.well-known/jwks.json'
IDP_ISSUER | URI of the issuer if different from IDP_SERVER | no | IDP_SERVER |
PERMISSION_CLAIM | Claim name in access token in that the permissions of the authenticated user is stored | no | 'roles' | 'roles', 'permissions', 'scope'