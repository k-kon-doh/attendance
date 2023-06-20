# 勤怠メンバー
class CreateAttendanceMembers < ActiveRecord::Migration[7.0]
  def change
    create_table :attendance_members do |t|
      t.integer :attendance_id, null: false # 勤怠ID
      t.integer :employee_id, null: false # 勤怠メンバーID
      t.index %i[attendance_id employee_id], unique: true
      t.index %i[employee_id attendance_id], unique: true
    end
  end
end
