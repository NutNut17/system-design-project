# TODO List

## 莉X

- [ ] 依圖片，用html form結合Primevue 的 Component，別用 PrimeVue 的 Form，他有bug，製造注冊填寫資料畫面和資料

- [] 注冊 UI: 注冊過程中需要填入個資。地址的部分，用以下鏈接製造雙語選地區欄位。先在前端的script裏寫各個地區的資料寫成json來模擬從伺服器取得該資料，然後再以v-for生成地區資料。[英文版](https://github.com/dennykuo/tw-city-selector/blob/master/src/data-en.js)， [中文版](https://github.com/dennykuo/tw-city-selector/blob/master/src/data-zh.js),[説明](https://dennykuo.github.io/tw-city-selector/#/zipcode)。另外也要要求使用者填寫銀行卡資料，上網查如何驗證卡的在正確性。避免使用jquery除非實在沒辦法。
- [] 登入 UI
- [] 忘記密碼 UI
- [] 提交的時候用regex檢查格式是否正確，

## 蘇X

- [] Create the database for user with the given attributes and add api endpoints and function to add, delete and edit the entries.
- [] Create a server logic(api and function “/signup”) to validate the create account request. Validate if account email, name existed in database. Use js library verificate an email validity on server. Check email verification API for reference.
- [] Create api endpoints and password verification for /signin, /forpas

## 凱X

- [ ] 依圖片建立資料庫
- [ ] 製造/getitems endpoint(get):伺服器將回傳全部商品的重點資料到前端（第一張圖片地址，名字，價格）
- [ ] 製造/getitem endpoint(get):伺服器將以item的id回傳該商品的全部資料到前端
- [ ] 製造/addcart endpoint(post):伺服器先確定使用者已登入，再把目前正在瀏覽的商品id和數量加到該用戶的購物車
- [ ] 製造/getcart endpoint(get):伺服器將使用者的購物車資料送到前端
- [ ] 製造/checkcart endpoint(post):伺服器將檢查該商品是否還有貨
- [ ] 製造/purchase endpoint(post):伺服器將下訂單

## 莉X

- [ ] 設計商店界面
- [ ] 設計商品資訊界面
- [ ] 設計購物車界面

### 有X

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

前端框架(Vue)：侯有X
UI設計(PrimeVue + CSS)：黃莉X
資料庫設計(SQLite): 李蘇X

伺服器邏輯：王凱X
雙語(Vue): 蘇莉X     [參考這裏](https://lokalise.com/blog/vue-i18n/)
資料庫資料采集：蘇莉X

進階功能探索：侯有X