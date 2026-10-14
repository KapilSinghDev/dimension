FROM node:22-alpine

WORKDIR /src

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 8000
ENV PORT=8000
ENV HOSTNAME=0.0.0.0

CMD ["npm", "run", "start"]
