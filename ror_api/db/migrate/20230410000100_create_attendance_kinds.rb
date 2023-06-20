# 勤怠種別
class CreateAttendanceKinds < ActiveRecord::Migration[7.0]
  def change
    create_table :attendance_kinds do |t|
      t.text :name, null: false, default: '' # 名称
      t.text :short_name, null: false, default: '' # 略称
      t.string :family, limit: 50, null: false # categories:attendance_family (1:単独 / 2:計画と実績)
      t.string :begin_date, limit: 50, null: false # categories:necessary (0:不要 / 1:必須 / 2:任意)
      t.string :begin_time, limit: 50, null: false # categories:necessary (0:不要 / 1:必須 / 2:任意)
      t.string :end_date, limit: 50, null: false # categories:necessary (0:不要 / 1:必須 / 2:任意)
      t.string :end_time, limit: 50, null: false # categories:necessary (0:不要 / 1:必須 / 2:任意)
      t.string :shift, limit: 50, null: false, default: '1' # categories:required (0:任意 / 1:必須 )
      t.string :reason, limit: 50, null: false, default: '1' # categories:required (0:任意 / 1:必須)
      t.integer :show_order, null: false, default: 1 # 表示順
      t.string :validity, limit: 50, null: false, default: '1' # categories:validity (0:無効 / 1:有効)
    end
  end
end
