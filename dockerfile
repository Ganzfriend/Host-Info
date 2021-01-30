FROM node:15.7.0
 WORKDIR /fec/host-info
 RUN npm install
 COPY . /fec/host-info
 ENV MONGODBURL='mongodb://database/fec'
 CMD ["node", "Server/index.js"]