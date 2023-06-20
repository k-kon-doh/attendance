# 組織
class CreateOrganizations < ActiveRecord::Migration[7.0]
  def change
    create_table :organizations do |t|
      t.string :code, limit: 10, null: false # 組織コード
      t.text :name, null: false, default: '' # 名称（JSONハッシュ）
      t.integer :upper_organization_id, null: true # 所属（上位）組織ID
      t.integer :hierarchy, null: false # 階層（0,1,2...）
      t.integer :show_order, null: false, default: 1 # 同一階層中の表示順
      t.string :validity, limit: 50, null: false, default: '1' # categories:validity (0:無効 / 1:有効)
    end
  end
end
