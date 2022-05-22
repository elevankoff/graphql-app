FROM mysql/mysql-server:latest

FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN apt-get update && apt-get install -y default-mysql-server \
    && apt-get install -y default-mysql-client \
    && apt-get install -y vim

COPY . .

EXPOSE 8080
CMD ["/bin/bash"]
RUN chmod +x ./start.sh
ENTRYPOINT ["./start.sh"]
