FROM node:16.15.0-buster-slim

# RUN mkdir -p /usr/share/man/man1 

RUN apt-get update && \
  apt-get install -y \
  wget \
  gnupg2 \
  curl \
  git-all \
  default-jre \
  dnsutils \
  jq

# Install psql client libraries
RUN sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt buster-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
RUN apt-get update && apt-get -y install postgresql-client

WORKDIR /home/code
COPY package.json package-lock.json ./
RUN npm ci

COPY ./utilities/dev_bashrc /root/.bashrc
COPY ./utilities/set_db_url.sh /bin/set_db_url.sh

WORKDIR /home/code
