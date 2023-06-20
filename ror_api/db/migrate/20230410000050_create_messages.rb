# メッセージ
class CreateMessages < ActiveRecord::Migration[7.0]
  def change
    create_table :messages do |t|
      t.string :keyword, limit: 50, null: false # メッセージキー
      t.text :message, null: false, default: '' # メッセージ（JSONハッシュ）
      t.index :keyword, unique: true
    end
  end
end
