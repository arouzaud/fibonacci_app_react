#first configuration phase: build with node base image, named as the "builder" phase
FROM node:16-alpine as builder
WORKDIR '/app'
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build
#the output from above will be a folder inside the /app directory named build


# start of second phase to set up the web server in another image
FROM nginx
#command for Elastic Beanstalk, when starting the container it will look at this instruction, and the port listed will be mapped to Beanstalk
EXPOSE 3000
#copy from one image to another
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

