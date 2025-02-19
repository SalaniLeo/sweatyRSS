#!/bin/bash
envsubst '$PORT' < /tmp/default.conf > /etc/nginx/conf.d/default.conf

# Start NGINX
nginx -g 'daemon off;'
