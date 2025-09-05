# IMY220_Project
Project for IMY220
## D0 
can be found in /wireframes

## D1
# CodeControl

Collaborate on code, share progress, and ship faster.  
**Tech:** React (manual Webpack+Babel, no CRA/Vite), Express, Node 20.  
**Ports:** App runs at `http://localhost:1337`.

## Quickstart (Local)
```bash
# install deps (from root)
npm i

# build client bundle
npx webpack

# transpile server
npm run build:server

# run server (serves frontend + API stubs)
npm start
# -> http://localhost:1337
```
## Docker
# running docker
docker build -t codecontrol .
docker run --rm -p 1337:1337 codecontrol
# -> http://localhost:1337
