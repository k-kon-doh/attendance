# 役割
class CreateRoles < ActiveRecord::Migration[7.0]
  def change
    create_table :roles do |t|
      t.text :name, null: false, default: '' # 名称（JSONハッシュ）
      t.integer :show_order, null: false, default: 1 # 表示順
    end
  end
end
