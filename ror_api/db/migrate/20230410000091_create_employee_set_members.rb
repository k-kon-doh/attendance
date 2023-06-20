# 社員セットメンバー
class CreateEmployeeSetMembers < ActiveRecord::Migration[7.0]
  def change
    create_table :employee_set_members do |t|
      t.integer :employee_set_id, null: false # 社員セットID
      t.integer :employee_id, null: false # 社員ID
      t.index %i[employee_set_id employee_id], unique: true
    end
  end
end
