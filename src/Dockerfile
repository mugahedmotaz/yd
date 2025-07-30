FROM node:20

RUN apt-get update && apt-get install -y python3 python3-pip ffmpeg && apt-get clean

WORKDIR /app

COPY . .

RUN npm install

CMD ["node", "backend/server.js"]
