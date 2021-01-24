FROM node:15.6.0-alpine3.12
RUN apk add g++ make python
ENV PORT=3105
WORKDIR /app
COPY ["package.json", "yarn-lock.json*", "./"]
RUN yarn install
COPY . /app
EXPOSE 3105
CMD ["yarn", "start"]
