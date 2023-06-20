# 役割
class CreateRoleFeatures < ActiveRecord::Migration[7.0]
  def change
    create_table :role_features do |t|
      t.integer :role_id, null: false # 役割ID
      t.text :feature, null: false, default: '' # 機能コード
    end
  end
end
