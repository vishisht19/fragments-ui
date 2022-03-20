# Stage 0: Install alpine Linux + node + dependencies
FROM node:16.14-alpine@sha256:72a490e7ed8aed68e16b8dc8f37b5bcc35c5b5c56ee3256effcdee63e2546f93 AS dependencies

ENV NODE_ENV=production

WORKDIR /app

# copy dep files and install the production deps
COPY package* ./
RUN npm ci 

#######################################################################

# Stage 1: use dependencies to build the site
FROM node:16.14-alpine@sha256:72a490e7ed8aed68e16b8dc8f37b5bcc35c5b5c56ee3256effcdee63e2546f93 AS builder

ENV NODE_ENV=production

WORKDIR /app
# Copy cached dependencies from previous stage so we don't have to download
COPY --from=dependencies /app /app
# Copy source code into the image
COPY . .
# Build the site to dist/
RUN npm run build

########################################################################

# Stage 2: nginx web server to host the built site
FROM nginx:stable-alpine@sha256:f9514712d6b8e29c57db7c5f83750fd0b5e2150c8ea983a1497704b39a7f0835 AS deploy

# Put our build/ into /usr/share/nginx/html/ and host static files
COPY --from=builder /app/dist/ /usr/share/nginx/html/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl --fail localhost:80 || exit 1