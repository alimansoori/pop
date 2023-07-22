FROM node:latest

ADD ./ /robot
WORKDIR /robot

RUN npm install
CMD npm run dev