FROM node:23-alpine3.20 AS compiler

USER node
WORKDIR /home/node

ADD --chown=node:node package.json .
ADD --chown=node:node package-lock.json .
RUN npm install

ADD --chown=node:node . .

RUN npm run purebuild

#------------------------------------------------------------

FROM node:23-alpine3.20

RUN apk add dumb-init

USER node
WORKDIR /home/node

COPY --from=compiler  /home/node/package.json ./package.json 
COPY --from=compiler --chown=node:node /home/node/package-lock.json ./package-lock.json
COPY --from=compiler --chown=node:node /home/node/server/ecmascript ./server/ecmascript
COPY --from=compiler --chown=node:node /home/node/server/public ./server/public
COPY --from=compiler --chown=node:node /home/node/server/json ./server/json

RUN npm install --omit=dev

ENTRYPOINT [ "/usr/bin/dumb-init", "--" ]
CMD [ "node", "server/ecmascript/start.js"]