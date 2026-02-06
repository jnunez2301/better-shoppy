---
trigger: always_on
---

Backend Dockerfile must look like this

```
FROM node:24-alpine3.21

WORKDIR /app

COPY . .

RUN npm install

CMD [ "npm", "start" ]
```