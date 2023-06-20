# 休日カレンダー
class CreateHolidays < ActiveRecord::Migration[7.0]
  def change
    create_table :holidays do |t|
      t.integer :organization_id, null: false, default: -1 # 組織ID：-1 は、デフォルト休日カレンダー
      t.date :holiday, null: false # 休日
      t.index %i[organization_id holiday], unique: true
      t.index %i[holiday organization_id], unique: true
    end
  end
end
