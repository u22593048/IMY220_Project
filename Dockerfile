FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci || npm i
COPY . .
RUN npx webpack && npm run build:server
ENV PORT=1337
EXPOSE 1337
CMD ["npm","start"]
