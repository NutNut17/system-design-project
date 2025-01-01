# About This Repository 關於這個專案

This is a repository project for my own system design course final project. Creating a full stack shopping website consisting some system design knowledge. Up to 1/1/2025, coming to the end of course, this project will not be maintained anymore but will be kept public for reference purpose. Admin's product and cart functionality is not completed yet and some bugs idenfified but not fixed. To check admin feature, use the account username='howwilson11@gmail.com', password='Abc12345'. 

這是我自己的系統設計課程期末專案的儲存庫專案。建立一個包含一些系統設計知識的全端購物網站。截至2025年1月1日，專題已經結束，該項目將不再維護，但將保持公開以供參考。管理員的產品和購物車功能尚未完成，並且已識別但未修復一些錯誤。若要檢查管理功能，請使用帳戶名稱='howwilson11@gmail.com'，密碼='Abc12345'。


# 請讀我：系統設計專題

1. 關於我們所使用的web tech，如果有不明白可以閲讀我做的筆記，裏面記錄著我第一次做網站的筆記，也就是本作業[Nut17 Notes](https://nutnut17.github.io/thulite-project/docs/web/web-tech-stack/)

2. 未完成作業和分工請到TODO.md看

3. 請到`./_information/reference.md` 看相關筆記

## Structure

```md
system-design-project/
├── _information/   這裏是大家交流，做筆記，記錄，教學，説明的地方
│   └── tmp.md      期中報告内容
├── frontend/       這是前端的資料夾，在這裏跑`npm run dev`啓動web server
├── backend/        這是後端的資料夾，在這裏跑`node server.js`啓動web server
└── .gitignore      GitHub 不用同步的路徑
└── README.md       本檔案的位子
```

## 安裝

請安裝`git`和`Node.js`后在terminal 跑以下步驟

```bash
cd frontend
npm install
# 然後你看到安裝了很多資料庫在node_modules裏表示成功
cd ../backend
npm install
```

## GitHub 操作

VS Code 已經有結合GitHub的功能，不需要額外下載然和東西。不懂問ChatGPT

1. 用自己的賬號fork一個你自己的分支
2. 到VS Code裏登入你的Github，並下載你的repository
3. 依上面步驟安裝環境
4. 開始你的開發
5. 開發完畢後/睡前把你本地端的code上傳到該Github分支上（push）
6. 同步Github和電腦的code后，開pull request要求跟縂repository合并
7. 之後每次開始coding之前先跟縂repository更新到你的分支(merge)然後去到第四步

## 可能會用到的 VS Code Extension

- Codeium: AI 輔助
- markdownlint
- SQLite Viewer
- Vue - Official
  