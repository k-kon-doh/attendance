# 勤怠管理システム (Attendance System)

勤怠管理システムのバックエンドです。

* バージョン

  - Ruby 3.2.2
  - Rails 7.0.5

* 準備と設定

  `bundle config set path 'vendor/bundle'`

  `bundle install`

  config/credentials.yml.enc は、使用していません。  
  config/credentials.yml.enc を削除し、  
  config/master.key と config/credentials.yml.enc を作成してください。  
  (環境変数 EDITOR の設定を忘れずに。例：`set EDITOR=code -w`)  
  `rails credentials:edit` 
 
  `rails db:migrate [RAILS_ENV=production]`

  config/initializers/cors.rb の origins を調整してください。

* データベースの初期化

  サーバーを立ち上げるたびにデータベースを初期化し、初期データをロードしています。(config.ru)

* 起動

  `rails server [-b IPアドレス] [-p ポート番号] [-e production]`