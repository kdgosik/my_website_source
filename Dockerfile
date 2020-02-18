FROM node
EXPOSE 8000
RUN npm install --global gatsby-cli
RUN npm install --save corejs