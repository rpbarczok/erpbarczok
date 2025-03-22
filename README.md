# ERPBarczok

ERPBarczok is a small training app I implemented to exercise the areas of full stack development. It is a demo version for a erp software for a small enterprise.

The use case of the software:
* daily use in the office
* remote use from other countries, e.g. China,  i.e connection with high rate of package loss
* remote use from areas with slow internet connection

## Architecture and Technology

I decided to use the following architecture:
* Frontend as Single Page App (SPA) installable as Progressive Web App (PWA)
* Backend API

I used following technologies:
* Express Backend (TypeScript, OpenApi, Swagger-UI, Mocha)
* React Frontend (TypeScript)

## Where to find

The software is provided on https://github.com/rpbarczok/panda2.

A docker image is provided on https://github.com/rpbarczok/panda2/pkgs/container/erpbarczok. The tag 'latest' provides the latest running build. It is created when merging a Pull Request into the main branch via GitHub Actions.

## Prerequisites
The application needs a PostgreSQL database to work.

The Application needs following environment variables to have access to the databse:
DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT

## Authentication and Authorization

The implementation of Auth works with Auth0 and EntraID. Dependent on which service you use, you must set different environment variables. For both services you must set following variables: CLIENT_ID, IDP_SERVER, AUDIENCE, SCOPE and PERMISSION_CLAIM. Additionally, you must set JWKS_URI variable for EntraID since you can not deduct it from the the IDP serve URI.

### Auth0 
For Auth0 you need to register the API and the Application at the 'Applications' tab. Please follow the Auth0 instructions to register them. For the application be sure to choose Single Page Application during the registration.

Additionally you have to create the roles 'admin' and 'user' at the 'roles' tab in the 'User Management'. You can assign these roles to the users. The admin has read and write rights to all objects in the database and can access all areas of the application. The user has read rights to all objects of the database and write rights to certain objects. They do not have access to all areas. An guest without any roles has read only rights and limited access.

Some of the necessary values of the environment variables you will be able to find here:

You will find the value of the __AUDIENCE__ variable in the settings of the API entry you created earlier as the 'Identifier'.

You will find the value of the __CLIENT_ID__ variable in the settings of the Application settings.

You will find the value for the __IDP_SERVER__ at the 'Tenant Settings' in the tab 'Custom Domains'.Use the domain with prefixed "https://' for the IDP_SERVER environment variable. 

Enter the URI of your application in the text box 'Allowed Callback URLs'. 

Additionally, set the __SCOPE__ variable to "openid email profile admin user" and the __PERMISSION_CLAIM__ to 'scope' if you use Auth0.


### EntraID
For EntraID you need to registry the API and the Application separately, too. Please follow the EntraID instructions to register them. For the application be sure to set Single Page Application during the registration.

ERPBarczok needs an JWT (JSON WEB TOKEN) that is not opaque. Therefore, you must navigate to the registry of the API. Open the tab manifest and change in the 'api' object the 'requestedAccessTokenVersion' to 2.

Then navigate to 'Expose an API' and add the scope 'use'. It is shown as "api://erpbarczok/use". Set  the __SCOPE__ variable to "openid email profile api://erpbarczok/use'.
At the next tab "App roles" create two new roles admin and user. You can later add these roles to different users of you application. For the role system of EntraID to work in your application, the __PERMISSION_CLAIM__ variable to "roles".

You will find the value of the __CLIENT_ID__ and the __AUDIENCE__ variable in the App registration area. The 'Application (client) ID' of the Application is the client id, the 'Application (client) ID' of the API is the audience.

You will find the value for the __IDP_SERVER__ at the App registrations. Click on the 'Endpoints' tab and search for 'Authority URL (Accounts in this organizational directory only)'.

You need the __JWKS_URI__ variable for EntraID. The easiest way to find it is to look for the 'OpenID Connect metadata document' in the endpoints offcanvas. Open this URI and look in the JSON file for the "jwks-uri". 

Additionally, set the __SCOPE__ variable to "openid email profile admin user" and the __PERMISSION_CLAIM__ to 'scope' if you use Auth0.

## Environment Variables:

Variable | Description | required? | Default Value | Example
-- | -- | -- | -- | --
NODE_ENV | describes the environment | yes | | 'production', 'development'
DB_NAME | Name of the used database | yes | | 'erpbarczok_db'
DB_USER | Name of the database user with access to the database | yes | | 'erpbarczok_app'
DB_PASSWORD | Password of the database user for to the database | yes | | 'test123!
DB_HOST | Host of the database | yes | | 'localhost'
DB_PORT | Port of the database | yes | | 5432
CLIENT_ID | Client id of the app in the authenticator | yes | |
IDP_SERVER | URI of the IDP Server | yes | | 'https://dev-example.eu.auth0.com/'
AUDIENCE | Audience of the app as given by the authentication provider | yes | | 
SCOPE | Scope needed to use the the application | no | 'openid email profile admin user' | 
PERMISSION_CLAIM | Claim name in access token in which the permissions of the authenticated user is stored | no | 'roles' | 'roles', 'permissions', 'scope'
CLIENT_ID_SWAGGER | client id for the swagger ui | no | CLIENT_ID |
JWKS_URI | URI of the JWKS key if different from the standard | no | IDP_SERVER + '.well-known/jwks.json'
