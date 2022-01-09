# Covid Cases Chart

A covid cases chart written with chartjs and reactjs. Uses data from https://github.com/CSSEGISandData/COVID-19.

### Prerequisites

NodeJS >= 14<br>
Docker

### Running locally

```
npm i
npm run build
docker run -d -p 27017-27019:27017-27019 -v ~/data:/data/db --name mongodb mongo:latest
npm run setup
```

The final setup will take a long time to download data and save to mongodb

```
npm run start
```
