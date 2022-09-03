FROM node:14-alpine
COPY . /app/client
RUN npm install
CMD npm start
