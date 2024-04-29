
FROM node:18-alpine
WORKDIR /prototype-node-alchemy-helper
COPY . .
RUN npm install
CMD [ "node", "index.js" ]
EXPOSE 6667
