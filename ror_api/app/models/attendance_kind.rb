# 勤怠種別
class AttendanceKind < ApplicationRecord
  include Localization

  localize_attribute :name, :short_name

  def self.whole
    cache.a
  end

  def self.value(id)
    cache.h[id]
  end

  AttendanceKindSet = Struct.new('AttendanceKindSet', :h, :a)
  private_constant :AttendanceKindSet

  def self.cache
    Rails.cache.fetch('AttendancdKind', expires_in: 1.hour) do
      kinds = AttendanceKindSet.new({}, [])
      all.order(show_order: :asc, id: :asc).each do |it|
        kinds.h[it.id] = it
        kinds.a.push(it)
      end
      kinds
    end
  end
  private_class_method :cache
end
