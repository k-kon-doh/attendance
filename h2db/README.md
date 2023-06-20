# 勤怠管理システム (Attendance System)

h2 database のデータベースを設定するバッチと SQL です。

※ データを変更する必要がなければ、下記処理は不要です。

* 準備

  h2runner.jar を作成し、bin フォルダにコピーしてください。

* データ作成

  sql\9000_inithial_data.sql がデータ用の SQL です。

  (勤怠データに関しては、日付調整のため rails 側で生成しています。)

  `bin\9999_h2runner.bat` でサーバーを起動してください。

  `bin\2000_createDb.bat`

  `bin\2000_export.bat` で csv フォルダに データがエクスポートされます。

  csv フォルダ内の *.csv ファイルを、ror_api\db\csv フォルダにコピーしてください。
  