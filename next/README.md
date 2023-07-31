# 勤怠管理システム (Attendance System)

勤怠管理システムのフロントエンドです。

* バージョン

  - NEXT 13.4.12
  - MUI 5.13.7

* 準備と設定

  `npm install`

  app.config.ts の apiURLを調整してください。

* 起動
  
  `npm run dev`  


   next.config.js の nextConfig に `output: "standalone"` を追加  
  `npm run build`  


   public フォルダを .next/standalone フォルダにコピー  
   .next/static フォルダを .next/standalone/.next フォルダにコピー  


  `cd .next/standalone`  
  `node server.js`  
  