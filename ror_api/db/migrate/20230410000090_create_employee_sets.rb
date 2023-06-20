# 社員セット
class CreateEmployeeSets < ActiveRecord::Migration[7.0]
  def change
    create_table :employee_sets do |t|
      t.text :name, null: false, default: '' # 名称
      t.integer :owner_organization_id, null: false # 所有組織ID
      t.integer :owner_employee_id, null: true # 所有者ID
      t.index :owner_organization_id
      t.index :owner_employee_id
    end
  end
end
