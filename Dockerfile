ARG NODE_VERSION=20.14.0

FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /usr/src/nirvana

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

FROM node:${NODE_VERSION}-alpine AS production

WORKDIR /usr/src/grave

COPY --from=builder /usr/src/nirvana/node_modules ./node_modules
COPY --from=builder /usr/src/nirvana/dist ./dist
COPY --from=builder /usr/src/nirvana/package*.json ./
COPY --from=builder /usr/src/nirvana/.env ./

CMD ["node", "dist/index.js"]
