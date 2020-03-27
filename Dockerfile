FROM node:12-alpine as gatolinero
LABEL maintainer="tonymtz <hello@tonymtz.com>"
WORKDIR /usr/src/app
COPY package*.json ./
ARG PORT=$PORT
ENV NODE_ENV=production
RUN npm install
COPY server .
EXPOSE ${PORT}
CMD [ "node", "index.js" ]
