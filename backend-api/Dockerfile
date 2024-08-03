FROM node:21-alpine

# Enviroment variables
ENV NODE_PORT=3000
ENV DIR=/usr/app
ENV SERVER_PORT="3002"

WORKDIR ${DIR}

COPY package*.json ./

COPY . .

# RUN npm install
RUN npm install -g npm@latest
RUN npm install rimraf --global
#RUN npm install --only=production && npm cache clean --force && npm install -g typescript && npm install rimraf --save
RUN npm install -g typescript && npm install rimraf --save
RUN npm run build

EXPOSE $NODE_PORT

# CMD ["ts-node", "src/network.ts"]
# CMD ["node", "build/network.js"]
CMD node build/network.js ${SERVER_PORT}

#CMD ["node", "build/app.js"]