# 設定
class CreateSettings < ActiveRecord::Migration[7.0]
  def change
    create_table :settings do |t|
      t.string :keyword, null: false # 設定キー
      t.text :setting_value, null: false # 設定値
      t.text :note, null: false, default: '' # 備考
    end
  end
end
