process.env.NODE_ENV="test"
process.env.DEBUG="erpbarczok:app"
process.env.DB_NAME="postgres"
process.env.DB_USER="postgres"
process.env.DB_PASSWORD="blablubber"
process.env.DB_HOST="localhost" 
process.env.DB_PORT='8081'

process.env.TEST_SECRET="secret"
process.env.ALGORITHM="HS256"

process.env.CLIENT_ID="123456789"
process.env.IDP_SERVER="www.example.com"
process.env.AUDIENCE="www.example.com"
process.env.SCOPE='openid email profile admin user'
process.env.PERMISSION_CLAIM = 'scope'