FROM node:20-alpine

WORKDIR /mcManagerBot

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "test"]