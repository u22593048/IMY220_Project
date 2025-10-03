FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package*.json ./
RUN npm ci --no-audit --progress=false
COPY . .
ENV NODE_ENV=production
RUN npx webpack --config webpack.config.cjs --mode=production
ENV PORT=1337
EXPOSE 1337
CMD ["npm","start"]
