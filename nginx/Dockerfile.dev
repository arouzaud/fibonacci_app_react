#any customisation for Nginx is done after getting the initial image of Nginx, and configuring it with the default.conf file (or nginx.conf file)
FROM nginx 
#we specified here the exact file named to be created in the container. Here we override the existing file, present by default with Nginx image in the below directory
COPY ./default.conf /etc/nginx/conf.d/default.conf