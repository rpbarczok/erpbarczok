# ERPBarczok

ERPBarczok is a small training app I implemented to exercise the areas of full stack development. It is the proof of concept of ERP software for a small enterprise.

## Requirements

* Daily use in the office
* Daily use from China (with restrictions due to the Golden Shield Project), i.e., high packet loss
* Remote use from areas with slow internet connection
* Responsive Design (Mobile and Desktop)
* automated rollout process
* platform independent
* transferable to other developers
* user roles

## Architecture and Technology

I decided to use the following architecture:
* Frontend as Single Page App (SPA) installable as Progressive Web App (PWA)
* Backend API
This architecture has the following advantages:
* Minimal communication between server and client
* Feasible responsive design
* Platform independence
* Automatic rollout

I used the following technologies for development:
* Express Backend (TypeScript, OpenApi, Swagger-UI, Mocha)
* React Frontend (TypeScript)
These architectures have the following advantages:
* A single framework for both frontend and backend
* modern, sustainable, and widely used technologies

The user role concept is achieved by OpenId Connect

## Releases

In my GitHub image repository you will find following images:
- **main**: This image is a stable version of the project
- **dev**: This image is version I'm currently working on

## Getting Started

1. Prerequisites
- Node.js (v20 or higher)
- PostgreSQL (v16 or higher)
- TypeScript (5.7 or Higher)
- Docker (optional, for containerized deployment)

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
Create a .env file in the root directory and add the required variables, (see also Database Configuration, Auth0 Configuration and EntraID Configuration).

5. Start the application:
   ```bash
    npm start
   ```

6. Access the application 
Open your browser and navigate to your URI


## General Configuration

NODE_ENV='production' or NODE_ENV='development'

## Database Configuration
The application needs a PostgreSQL database to work.

Required Environment Variables for the PostgreSQL-Database

Variable | Example
-- | -- 
DB_NAME='\<your-db-name>' | 'erpbarczok_db'
DB_USER='\<your-db-user>' | 'erpbarczok_app'
DB_PASSWORD='\<your-db-password>' | Password of the database user for the database | 'test123!'
DB_HOST='\<your-db-host>' | Host of the database | 'localhost'
DB_PORT=\<your-db-port> |  5432

## Authentication and Authorization

The implementation of Auth works with Auth0 and EntraID. Depending on which service you use, you must set different environment variables.

### Auth0 Configuration
For Auth0, you need to register the API and the Application at the 'Applications' tab. Please follow the official Auth0 instructions to register them. For the application, be sure to choose Single Page Application during the registration.
Enter the URI of your application in the 'Allowed Callback URLs' field. If you want to use the Swagger UI, you must also add its URI to this field.

Additionally, you have to create the roles __admin__ and __user__ at the 'roles' tab in the 'User Management'. You can assign these roles to the users. The admin has read and write rights to all objects in the database and can access all areas of the application. The user has read rights to all objects of the database and write rights to certain objects. They do not have access to all areas. A guest without any roles has read-only rights and limited access.

Required Environment Variables for Auth0

Variable | Where to find at Auth0 
 -- | -- 
 CLIENT_ID='\<your-client-id>' |  in the settings of the Application settings 
IDP_SERVER='\<your-idp-server>' | at the 'Tenant Settings' in the tab 'Custom Domains'. Use the domain prefixed with 'https://' for the IDP_SERVER environment variable 
 AUDIENCE='\<your-audience>' | in the settings of the API entry you created earlier as the 'Identifier' 
 PERMISSION_CLAIM='permissions' | 
 CLIENT_ID_SWAGGER='\<your-client-id-for-swagger>' | Only if you have registered the Swagger UI as its own application, otherwise it works with the client_id 

### EntraID Configuration
For EntraID, you need to register the API and the Application separately, too. Follow the official EntraID documentation to register the API and Application.. For the application, be sure to set Single Page Application during the registration.

ERPBarczok needs a JWT (JSON Web Token) that is not opaque. Therefore, you must navigate to the registry of the API. Open the tab 'manifest' and set in the JSON file in the 'api' object the property 'requestedAccessTokenVersion' to 2.

Then navigate to 'Expose an API' and add the scope 'use'. It is then shown as 'api://erpbarczok/use'.
At the next tab 'App roles' create two new roles: admin and user. You can later add these roles to the users of your application.

Required Environment Variables for EntraID

Variable | Where to find at EntraID
-- | --  
CLIENT_ID='\<your-client-id>' |  in the App registration area: 'Client ID' in the table
IDP_SERVER='\<your-idp-server>' | in the endpoints offcanvas as 'Authority URL (Accounts in this organizational directory only)' 
AUDIENCE='\<your-audience>'  | in the App registration area, the 'Application (client) ID' in the Table
SCOPE='openid email profile api://erpbarczok/use' |
JWKS_URI='\<your-jwks_uri>' | URI of the JWKS key if different from the standard |  open the URI of the 'OpenID Connect metadata document' (found in the endpoints offcanvas) and look in the JSON for the value of 'jwks-uri'. 
CLIENT_ID_SWAGGER='\<your-client-id-for-swagger>' | Only if you have registered the Swagger UI as its own application, otherwise it works with the client_id