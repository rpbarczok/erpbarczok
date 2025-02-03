FROM --platform=$BUILDPLATFORM node:23-alpine3.20 AS build

USER node
WORKDIR /home/node

ADD --chown=node:node package.json .
RUN npm install

ADD --chown=node:node . .

RUN npx webpack --config webpack.prod.js && rm -fR server/ecmascript && npx tsc

#------------------------------------------------------------

FROM node:23-alpine3.20 AS erpbarczok

RUN apk add dumb-init

USER node
WORKDIR /home/node

COPY --from=build  /home/node/package.json ./package.json 
COPY --from=build --chown=node:node /home/node/server/ecmascript ./server/ecmascript
COPY --from=build --chown=node:node /home/node/server/public ./server/public

RUN npm install --omit=dev

ENTRYPOINT [ "/usr/bin/dumb-init", "--" ]
CMD [ "node", "server/ecmascript/start.js"]