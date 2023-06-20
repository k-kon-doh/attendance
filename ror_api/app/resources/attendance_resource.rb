# 勤怠情報
class AttendanceResource < ApplicationResource
  transform_keys :lower_camel

  on_nil do |_, key|
    { choiceId: '', name: '' } if %w[agent approver].include?(key)
  end

  attributes :id
  attributes :attendance_kind_id
  attributes :status
  attributes :subfamily
  attributes :execution

  attributes :begin_date
  attributes :begin_time
  attributes :end_date
  attributes :end_time

  attributes :shift

  attributes :reason
  attributes :application_date
  one :agent, resource: PartialEmployeeResource
  one :approver, resource: PartialEmployeeResource
  attributes :approval_date
  attributes :approval_comment
  attributes :related_id

  attributes :validity

  attributes :lock_version
  many :employees, resource: PartialEmployeeResource
  attribute :applicants do |resource|
    resource.applicants.map do |it|
      it.transform_keys { |key| transform_key(key) }
    end
  end
end
