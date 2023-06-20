# 勤怠申請種別
class AttendanceKindResource < ApplicationResource
  transform_keys :lower_camel

  attributes :id
  attribute :name, &:localized_name
  attribute :short_name, &:localized_short_name
  attributes :family
  attributes :begin_date, :begin_time
  attributes :end_date, :end_time
  attribute :shift do |it|
    it.shift.casecmp('TRUE').zero?
  end
  attribute :reason do |it|
    it.reason.casecmp('TRUE').zero?
  end
  attributes :show_order
  attributes :validity
end
