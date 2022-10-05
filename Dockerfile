FROM nginx:alpine
COPY dist/contabilidade-web2/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf