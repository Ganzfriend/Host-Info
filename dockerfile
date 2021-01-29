FROM node:15.7.0
 WORKDIR /fec/host-info
 RUN npm install
 COPY . /fec/host-info
 ENV MONGODBURL='mongodb://database:27017/fec'
 CMD ["node", "Server/index.js"]