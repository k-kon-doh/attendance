# 勤怠メンバー
class AttendanceMember < ApplicationRecord
  belongs_to :attendance
  belongs_to :employee
end
