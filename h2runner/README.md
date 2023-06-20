# 勤怠管理システム (Attendance System)

h2 database の下記サーバーを起動する Java プログラムです。

* サーバー

  - TCP サーバー（デフォルトポート： 9092）
  - PostgreSQL(ODBC) サーバー（デフォルトポート： 5435）
  - Web サーバー（Webコンソール）（デフォルトポート： 8082）

* 準備

  `gradlew build`

  h2runner.jar を ../h2db/bin フォルダにコピーしてください。