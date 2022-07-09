FROM node:latest

RUN npm install --global nodecg-cli

WORKDIR /nodecg

RUN nodecg setup

RUN nodecg install speedcontrol/nodecg-speedcontrol

EXPOSE 9090

CMD ["node", "index.js"]

