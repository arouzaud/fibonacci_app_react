FROM node:14.14.0-alpine

WORKDIR '/app'

COPY ./package.json ./
RUN npm install
COPY . .
CMD [ "npm", "run", "start"]

#rather than npm run dev used for the dev environment
#start and dev correspond to scripts in the package.json file