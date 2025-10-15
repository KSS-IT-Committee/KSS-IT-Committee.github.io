FROM nginx:alpine

# Copy custom nginx config for SPA routing
COPY ./default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]