FROM node:15.7.0
 WORKDIR /fec/host-info
 RUN npm install
 COPY . .
 ENV MONGODBURL='mongodb://database/fec'
 CMD ["node", "Server/index.js"]