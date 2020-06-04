FROM node:13.12.0-alpine
WORKDIR /var/messemger/frontend
ENV PATH /var/messemger/frontend/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm i
RUN npm i react-scripts
COPY . ./

RUN rm -rf ./build/*
RUN npm run build
RUN rm package*.json
RUN rm -rf node_modules
