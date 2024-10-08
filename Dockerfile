ARG NODE_VERSION=20.14.0

FROM node:${NODE_VERSION}-alpine AS builder

# Install dependencies
WORKDIR /usr/src/
COPY package*.json ./

RUN apk add --no-cache \
    python3 \
    build-base \
    g++ \
    cairo-dev \
    pango-dev \
    libjpeg-turbo-dev \
    giflib-dev \
    librsvg-dev \
    pixman-dev \
    libc6-compat # Adds glibc

RUN npm ci --only=production
COPY . .
RUN npm install
RUN npm run build

FROM node:${NODE_VERSION}-alpine AS production
WORKDIR /usr/src/
COPY --from=builder /usr/src/node_modules ./node_modules
COPY --from=builder /usr/src/dist ./dist
COPY --from=builder /usr/src/prisma ./prisma
COPY --from=builder /usr/src/package*.json ./
RUN addgroup -S nirvana && adduser -S developers -G nirvana
RUN chown -R developers:nirvana /usr/src

USER developers

CMD ["npm", "start"]
