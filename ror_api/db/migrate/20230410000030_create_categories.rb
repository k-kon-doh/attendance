# カテゴリー
class CreateCategories < ActiveRecord::Migration[7.0]
  def change
    create_table :categories do |t|
      t.string :keyword, limit: 50, null: false # カテゴリーキー
      t.string :code, limit: 50, null: false # カテゴリーコード
      t.text :name, null: false, default: '' # 名称（JSONハッシュ）
      t.text :short_name, null: false, default: '' # 略称（JSONハッシュ）
      t.integer :show_order, null: false, default: 1 # 表示順
      t.index %i[keyword code], unique: true
    end
  end
end
