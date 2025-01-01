# TODO List

## 莉涵

- [ ] 依圖片，用html form結合Primevue 的 Component，別用 PrimeVue 的 Form，他有bug，製造注冊填寫資料畫面和資料

- [] 注冊 UI: 注冊過程中需要填入個資。地址的部分，用以下鏈接製造雙語選地區欄位。先在前端的script裏寫各個地區的資料寫成json來模擬從伺服器取得該資料，然後再以v-for生成地區資料。[英文版](https://github.com/dennykuo/tw-city-selector/blob/master/src/data-en.js)， [中文版](https://github.com/dennykuo/tw-city-selector/blob/master/src/data-zh.js),[説明](https://dennykuo.github.io/tw-city-selector/#/zipcode)。另外也要要求使用者填寫銀行卡資料，上網查如何驗證卡的在正確性。避免使用jquery除非實在沒辦法。
- [] 登入 UI
- [] 忘記密碼 UI
- [] 提交的時候用regex檢查格式是否正確，

## 蘇憑

- [] Create the database for user with the given attributes and add api endpoints and function to add, delete and edit the entries.
- [] Create a server logic(api and function “/signup”) to validate the create account request. Validate if account email, name existed in database. Use js library verificate an email validity on server. Check email verification API for reference.
- [] Create api endpoints and password verification for /signin, /forpas

## 凱樂

- [ ] 依圖片建立資料庫
- [ ] 製造/getitems endpoint(get):伺服器將回傳全部商品的重點資料到前端（第一張圖片地址，名字，價格）
- [ ] 製造/getitem endpoint(get):伺服器將以item的id回傳該商品的全部資料到前端
- [ ] 製造/addcart endpoint(post):伺服器先確定使用者已登入，再把目前正在瀏覽的商品id和數量加到該用戶的購物車
- [ ] 製造/getcart endpoint(get):伺服器將使用者的購物車資料送到前端
- [ ] 製造/checkcart endpoint(post):伺服器將檢查該商品是否還有貨
- [ ] 製造/purchase endpoint(post):伺服器將下訂單

## 莉珊

- [ ] 設計商店界面
- [ ] 設計商品資訊界面
- [ ] 設計購物車界面

### 有鍵

- [] 完成初始設置
- [] 介紹界面
- [] Blogging界面
- [] 管理者界面
- [] 研究Mongo
- [] web deploy

## 更多

- [] 更豐富的字體 [Variable fonts](https://fonts.google.com/knowledge/introducing_type/introducing_variable_fonts)

### 整體分工大方向

系統: 侯有鍵

前端框架(Vue)：侯有鍵
UI設計(PrimeVue + CSS)：黃莉珊
資料庫設計(SQLite): 李蘇憑

伺服器邏輯：王凱樂
雙語(Vue): 蘇莉涵     [參考這裏](https://lokalise.com/blog/vue-i18n/)
資料庫資料采集：蘇莉涵

進階功能探索：侯有鍵

## Docker Note

| Images | The blueprints of our application which form the basis of containers. Image are being pushed and pulled. |
| Containers | Created from Docker images and run the actual application |
| Docker Daemon | The background service running on the host that manages building, running and distributing Docker containers. The daemon is the process that runs in the operating system which clients talk to. |
| Docker Client | The command line tool that allows the user to interact with the daemon. More generally, there can be other forms of clients too - such as Kitematic which provide a GUI to the users. |
| Docker Desktop | A desktop app with a GUI to organize dockers. |
| Docker Hub | A remote registry of Docker images ready to be pushed and pulled. |

## Docker Commands

### Lists all images

```bash
    docker ps -a:
```

| Information | Description |
| - | - |
| Image id| unique hash identifier |
| Image name | name for image |
| Repository name | The source name of the image in a Docker registry (e.g., Docker Hub). Example: myusername/my-backend-app |
| Tag | A label to differentiate image versions. Example: v1.0, latest. |

### Pull

```bash
docker pull <image_name>
```

The `pull` command fetches the image from the [**Docker registry**](https://hub.docker.com/explore/) and saves it to our system. Image format like `respository/image`, `repository/image:version` format is user defined image and image format like `server:version` is official images.

### Push

```bash
# This is required for credentials
docker login

docker push <username/project>
```

### Run

```bash
docker run <image_name>

# Open terminal for container
docker run -it <image_name> sh

# Show running ports
docker port <image_name>

# Stop container
docker stop <image_name>
```

### Tag

```bash
```

### Remove

```bash
docker rm <image_id>
```

### Multiplatform build and push

```bash
docker buildx build --platform linux/amd64,linux/arm64 -t respository/project:version --push .
```

## Dockerfile

A file to configure how a docker is deployed. In this section, an example project for a full stack deployment on docker will be shown.

### Container Project Structure

```

```

To start with docker, initialize a normal repository and add docker related files to build the container.

```Dockerfile
# Build stage
FROM node:alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

This is the content of frontend `Dockerfile`. The `FROM` specifies a base image with node server and using lightweight and multiplatform alpine version. The working directory inside the container will be at `/app`. Then, the local json package file will be copied to the container first to initialize the modules by npm. Then, the rest of local file will be copied to the docker container. Note that the files specified in `.docketignore` will not be copied to the container. After the frontend in container have been built, the container will use ngnix web server of alpine version and and host it on `port 80` of the container.

```Dockerfile
FROM node:alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]
```

This is the content of backend `Dockerfile`. It expose port 3000 of the container. Then it runs the `npm start` command defined in `package.json` to start the server inside the container.

```yml
version: '3.8'

services:
  backend:
    build: 
      context: ./backend
    ports:
      - "3000:3000"
    env_file:
      - ./backend/.env

  frontend:
    build: 
      context: ./frontend
    ports:
      - "5173:80"
```

This is a `docker-compose.yml` file, it's the starting point of the docker to run and the image container is defined in `Dockerfile`. In the configuration of the ports, `5173:80` indicates the port 80 in the container is accessible at port 5173 at the host server.

```bash
# Tag might be needed
docker tag docker-test-frontend  nut17/docker-test:frontend   
```

To build and push the image to the repository, run the following code in frontend's terminal. Alpine supports for linux arm64 and amd64 but it cannot work on windows. After the image is built in couple of time, the image will be uploaded to a repository. Do the same for backend. In case of cloud deploy, if the frontend and backend is at different server, the backend api url of frontend had to be adjusted to match.

```bash
docker buildx build --platform linux/amd64,linux/arm64 -t nut17/docker-test:frontend --push .
```