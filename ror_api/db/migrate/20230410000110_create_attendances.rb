# 勤怠
class CreateAttendances < ActiveRecord::Migration[7.0]
  def change
    create_table :attendances do |t|
      t.integer :attendance_kind_id, null: false # 勤怠種別ID
      t.string :status, limit: 50, null: false # categories:attendance_status (1:作成中 / 2:申請中 / 3:承認 / 4:却下)
      t.string :subfamily, limit: 50, null: false # categories:attendance_subfamily(1:単独 / 2:計画 / 3:実績)
      t.string :execution, limit: 50, null: false #  categories:attendance_execution(0:未実施 / 1:実施済み)
      t.date :begin_date, null: true # 開始日
      t.string :begin_time, limit: 5, null: false, default: '' # 開始時刻（'00:00' - '47:59'）
      t.date :end_date, null: true # 終了日
      t.string :end_time, limit: 5, null: false, default: '' # 終了時刻（'00:00' - '47:59'）
      t.string :shift, limit: 50, null: false, default: '' # 勤務形態
      t.text :reason, null: false, default: '' # 理由
      t.date :application_date, null: true # 申請日
      t.integer :agent_id, null: true # 代理申請者ID
      t.integer :approver_id, null: true # 承認者ID
      t.date :approval_date, null: true # 承認日
      t.text :approval_comment, null: false, default: '' # 承認コメント
      t.integer :related_id, null: true # null / 複写元ID / 計画申請ID
      t.string :validity, limit: 50, null: false, default: '1' # categories:validity (0:無効 / 1:有効)
      t.integer :lock_version, default: 0
      t.timestamps
    end
  end
end
