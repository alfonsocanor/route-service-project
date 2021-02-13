FROM node:15.6.0-alpine3.10
RUN apk add g++ make python
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
EXPOSE 3111
CMD ["npm", "start"]