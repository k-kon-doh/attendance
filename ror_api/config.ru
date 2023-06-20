# This file is used by Rack-based servers to start the application.

require_relative 'config/environment'

run Rails.application
Rails.application.load_server

# デモ用サンプルなので、Rails アプリを起動するたびにDBテーブルの内容を初期化
DbInitializer.init

# 設定モデル用のキーを定数化
# Object.const_set(:SettingKey, Module.new do |mod|
#  Setting.pluck(:id).each do |id|
#    mod.const_set(id.upcase.to_sym, id.to_sym)
#  end
# end)
