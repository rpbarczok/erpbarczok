<!-- markdownlint-disable MD033 -->
# ERPBarczok

ERPBarczok is a proof of concept I implemented to validate an architectural decision for an ERP software of a small enterprise.

It implements the scaffold for this type of application, but lacks any business logic.
My aim was to validate the scaffold, and the contents of this repo fulfill this purpose.

So running this software will presumably not be very useful.
But feel free to use it as a scaffold for your architecture or to copy pieces into your project.
MIT license applies. 

## Considered Requirements

The architecture should consider the following requirements:

1. Daily use in the office
2. Daily use from China (capability to handle limitations by the Golden Shield Project, i.e. packet loss)
3. Remote use from areas with slow internet connection
4. Desktop design mimicking an existing Access UI
5. Modern mobile design
6. User roles
7. Platform independent client
8. Automated rollout process for the client
9. Use of modern frameworks, IDEs, and programming languages, so knowledge is available on the market
10. As few programming languages and frameworks as possible

## Architectural Decisions

Based on the _requirements_ I decided to use the following architecture:

* 10: Server and client need to use the same programming language: ECMAScript/TypeScript.
* 2/3: Classical web application excluded, API approach with application installed and running on client:
  * 7: Frontend as Single Page App (SPA)
  * 2/3: Installable as Progressive Web App (PWA), running purely on the client  
    Minimal communication between server and client, maximal perceived responsiveness
  * 9: Backend API based on OAS/OpenAPI
* 4/5: Bootstrap responsive design
* 8: Automated rollout through PWA and service worker
* 6: Roles via OIDC
* 10: Server backend using postgres because of available knowledge
* 1: no additional constraints

Based on these decisions, I use the following technologies for development:

* Express Backend (TypeScript, OpenAPI, Swagger-UI, Mocha)
* React Frontend (TypeScript, OpenAPI, axios, React testing library)
* Authentication and Authorization via OpenID Connect
  
From a _developer perspective_, these choices have the following advantages:

* A single framework for both frontend and backend
* modern, sustainable, and widely used technologies

## Getting Started

### With Docker

1. Prerequisites:
* Node.js (v20 or higher)
* Docker

2. Clone the repository:

   ```bash
   git clone https://github.com/rpbarczok/erpbarczok.git
   cd erpbarczok
   ```

3. Install dependencies

   ```bash
    npm install
   ```
4: run docker

   ```bash
   cd container
   cd docker compose up
   ```

5: Access the application 

Go to http://localhost:8080

Click on lockin

Enter ``test_user`` pw: ``test``

To make changes in keycloak:

Go to http://localhost:8081

Enter ``admin`` pw: ``admin``


### With node.js

1. Prerequisites
   * Node.js (v20 or higher)
   * PostgreSQL (v16 or higher)
   * Typescript (v5 or higher)
   * EntraID or Auth0 Tenant (or any other OIDC IDP)
   * Docker (optional, for containerized deployment)

2. Clone the repository:

   ```bash
   git clone https://github.com/rpbarczok/erpbarczok.git
   cd erpbarczok
   ```

3. Install dependencies

   ```bash
    npm install
   ```

4. Set up environment variables

   Create a `.env` file in the root directory of the project and add the required variables, (see below: Database Configuration, Auth0 Configuration and EntraID Configuration).

   <details>
      <summary>Example</summary>
      &nbsp;

      `.env` file example - this won't work verbatim, please replace the example values by your real values.

      ```bash
      NODE_ENV=development
      DB_NAME=erpbarczok_db
      DB_USER=erpbarczok_app
      DB_PASSWORD='test123!'
      DB_HOST=localhost
      DB_PORT=5432
      CLIENT_ID=erpbarczok
      IDP_SERVER=http://localhost:8080/realms/erpbarczok/
      AUDIENCE=erpbarczok-api
      PERMISSION_CLAIM=roles
      CLIENT_ID_SWAGGER=erpbarczok-swagger
      ```

   </details>
   &nbsp;

5. Start the application:

   ```bash
    npm start
   ```

6. Access the application 

   Open your browser and navigate to <http://localhost:3000>

## Configuration

### General Configuration

`NODE_ENV=production` or `NODE_ENV=development`

### Database Configuration

The application needs a PostgreSQL database to work.

Required Environment Variables for the PostgreSQL-Database

| Variable      | Value              | Example                  |                                                |
| ------------- | ------------------ | ------------------------ | ---------------------------------------------- |
| `DB_NAME`     | _your-db-name_     | `DB_NAME=erpbarczok_db`  |                                                |
| `DB_USER`     | _your-db-user_     | `DB_USER=erpbarczok_app` |                                                |
| `DB_PASSWORD` | _your-db-password_ | `DB_PASSWORD='test123!'` | Password of the database user for the database |
| `DB_HOST`     | _your-db-host_     | `DB_HOST=localhost`      | Host of the database                           |
| `DB_PORT`     | _your-db-port_     | `DB_PORT=5432`           |                                                |

### Authentication and Authorization

The implementation of Auth works with Auth0 and EntraID. Depending on which service you use, you need to set different environment variables.

<details>
   <summary>Auth 0 Example</summary>
   &nbsp;

   For Auth0, you need to register the API and the Application at the _Applications_ tab. Please follow the official Auth0 instructions to register them. For the application, be sure to choose _Single Page Application_ during the registration.
   Enter the URI `http://localhost:3000` of your application in the _Allowed Callback URLs_ field. If you want to use the Swagger UI, you also need to add its URI `http://localhost:3000/docs/` to this field.

   Additionally, you need to create the roles `admin` and `user` at the _roles_ tab in the _User Management_. You can assign these roles to the users. The `admin` has read and write rights to all objects in the application and can access all areas of the user interface. The `user` has read rights to all objects of the application and write rights to certain objects. Users do not have access to all areas. A guest without any roles has read-only rights and limited access.

   Required Environment Variables for Auth0

   | Variable            | Value                        | Example                                                 | Where to find at Auth0                                                                                                                  |
   | ------------------- | ---------------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
   | `CLIENT_ID`         | _your-client-id_             | `CLIENT_ID=CHzm8u0oBYPYlLbY6JiqPgQG2ll91G3t`            | in the settings of the Application settings                                                                                             |
   | `IDP_SERVER`        | _your-idp-server_            | `IDP_SERVER=https://dev-xlky0bm3nsusygw7.eu.auth0.com/` | at the _Tenant Settings_ in the tab _Custom Domains_. Use the domain prefixed with `https://` for the `IDP_SERVER` environment variable |
   | `AUDIENCE`          | _your-audience_              | `AUDIENCE=http://localhost:8080`                        | in the settings of the API entry you created earlier as the _Identifier_                                                                |
   | `PERMISSION_CLAIM`  | _permissions_                | `PERMISSION_CLAIM=permissions`                          |                                                                                                                                         |
   | `CLIENT_ID_SWAGGER` | _your-client-id-for-swagger_ | `CLIENT_ID_SWAGGER=3W7Vgm8JQJSe1YoxksxXLm5qBBiWgDZf`    | Only if you have registered the Swagger UI as its own application, otherwise it works with the client_id                                |

</details>
<details>
   <summary>EntraID Example</summary>
   &nbsp;

   For EntraID, you need to register the API and the Application separately, too. Follow the official EntraID documentation to register the API and Application. For the application, be sure to set _Single Page Application_ during the registration.

   ERPBarczok needs a JWT (JSON Web Token) that is not opaque. Therefore, you must navigate to the registry of the API. Open the tab _manifest_ and set in the JSON file in the `api` object the property `requestedAccessTokenVersion` to `2`.

   Then navigate to _Expose an API_ and add the scope `use`. It is then shown as `api://erpbarczok/use`.
   At the next tab _App roles_ create two new roles: `admin` and `user`. You can later add these roles to the users of your application.

   Required Environment Variables for EntraID

   | Variable            | Value                                         | Example                                                                                               | Where to find at EntraID                                                                                                                                                                         |
   | ------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | `CLIENT_ID`         | _your-client-id_                              | `CLIENT_ID=b1004acb-91dc-4d6a-bebf-ed21f38c83cd`                                                      | in the App registration area: 'Client ID' in the table                                                                                                                                           |
   | `IDP_SERVER`        | _your-idp-server_                             | `IDP_SERVER=https://login.microsoftonline.com/43aa1d23-d97f-4178-a9d8-917442f8d7af/v2.0`              | in the endpoints offcanvas as 'Authority URL (Accounts in this organizational directory only)'                                                                                                   |
   | `AUDIENCE`          | _your-audience_                               | `AUDIENCE=8423a3bf-b11c-4f0d-b3e5-4e8241f8a434`                                                       | in the App registration area, the 'Application (client) ID' in the Table                                                                                                                         |
   | `SCOPE`             | `"api://erpbarczok/use openid email profile"` | `SCOPE="openid email profile api://erpbarczok/use"`                                                   |
   | `JWKS_URI`          | _your-jwks_uri_                               | `JWKS_URI=https://login.microsoftonline.com/43aa1d23-d97f-4178-a9d8-917442f8d7af/discovery/v2.0/keys` | URI of the JWKS key if different from the standard - open the URI of the _OpenID Connect metadata document_ (found in the endpoints offcanvas) and look in the JSON for the value of `jwks-uri`. |
   | `CLIENT_ID_SWAGGER` | _your-client-id-for-swagger_                  | `CLIENT_ID_SWAGGER=c170d1cb-91af-446a-bdbd-ec24f3cc81cd`                                              | Only if you have registered the Swagger UI as its own application, otherwise it works with the client_id                                                                                         |

</details>
<details>
   <summary>Keycloak Example</summary>
   &nbsp;

   For Keycloak, you need to create a new realm (e.g. erpbarczok) and switch to it. Within this realm, register both the API and the application under the _Clients_ tab. 
   
   Registering the API:
   
     * _General settings_: Choose a name e.g. erpbarczok_api. 
     * _Capability config_: Uncheck it in the authentication flow. 
     * _Login settings_: No entries required here.

   After registering the API open the the newly created register entry
   
     * Go to _Roles_ and create two roles: admin and user
     * In _Client scopes_ 
       * Add erpbarczok as default
       * Select *erpbarczok_api-dedicated*, go to _Scope_ and disable _Full scope allowed_

   Registering the Application
   
      * In General settings, enter a name (e.g., erpbarczok_app) and enable Always display in UI.
      * In Capability config, ensure Standard flow is checked (default).
      * In Login settings, enter the URLs of your application.
      * In Web Origins, enter a + in the input field.

   After registering the application, open the newly register entry
   
     * In _Client scopes_ 
       * Add erpbarczok as default
       * Select *erpbarczok_api-dedicated*, go to _Scope_ and disable _Full scope allowed_
      * In the _Clients_ tab, select your app, go to Client scopes, and add erpbarczok as default.

   User Management
      * Users can be added under the User tab.
      * To allow the app to accept a user, assign the role erpbarczok:admin or erpbarczok:user to the user.

   Required Environment Variables for Keycloak

   | Variable           | Value                                     | Example                                                                             | Where to find in Keycloak                                     |
   | ------------------ | ----------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------- |
   | `CLIENT_ID`        | _your-client-id_                          | `CLIENT_ID=erpbarczok_app`                                                          | in the tag _Clients_, Client ID of the app                    |
   | `IDP_SERVER`       | _your-idp-server_                         | `IDP_SERVER=https://keycloak.barczok/realms/erpbarczok`                             | the URL of the keycloak server + /realms/ + name of the realm |
   | `AUDIENCE`         | _your-audience_                           | `AUDIENCE=erpbarczok_api`                                                           | in the tag _Clients_, Client ID of the api                    |
   | `SCOPE`            | `"openid email profile erpbarczok"`       | `SCOPE=""openid email profile erpbarczok""`                                         |                                                               |
   | `PERMISSION_CLAIM` | `resource_access.`_your-audience_`.roles` | `PERMISSION_CLAIM="resource_access.erpbarczok_api.roles"`                           |                                                               |
   | `JWKS_URI`         | _your-jwks-uri_                           | `JWKS_URI=https://keycloak.barczok/realms/erpbarczok/protocol/openid-connect/certs` |                                                               |
</details>
&nbsp;

## Releases

In the [GitHub Container Registry](https://github.com/rpbarczok/erpbarczok/pkgs/container/erpbarczok) you will find the following container images:

* **main**: This image is a stable version of the project
* **dev**: This image is the version I'm currently working on
