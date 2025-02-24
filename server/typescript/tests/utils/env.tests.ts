export const secret = "secret"
export const algorithm = "HS256"

process.env.NODE_ENV="test"
process.env.DEBUG="panda2:app"
process.env.DB_NAME="postgres"
process.env.DB_USER="postgres"
process.env.DB_PASSWORD="blablubber"
process.env.DB_HOST="localhost"
process.env.DB_PORT='8081'
process.env.SECRET = "secret"
process.env.ALGORITHMS = 'HS256'
process.env.CLIENT_ID='blablubber'
process.env.AUDIENCE='blablubber.com'
process.env.IDP_SERVER='blablubber'
process.env.REDIRECT_URI='blablubber'