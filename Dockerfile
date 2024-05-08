FROM --platform=linux/amd64 node:19

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

RUN npm i @google-cloud/storage

CMD [ "node", "pull.js" ]