FROM node:15.0.1-slim
WORKDIR /app
COPY package.json /app
RUN npm install -g --force nodemon
RUN npm install
COPY . /app
CMD ["npm", "start"]