# 勤怠
class Attendance < ApplicationRecord
  has_many :attendance_members, dependent: nil
  has_many :employees, through: :attendance_members
  accepts_nested_attributes_for :attendance_members, allow_destroy: true

  belongs_to :agent, class_name: 'Employee', inverse_of: 'agent_attendances', optional: true, dependent: nil
  belongs_to :approver, class_name: 'Employee', inverse_of: 'approver_attendances', optional: true, dependent: nil

  attribute :applicants, array: true, default: -> { [] }

  validates :status, presence: true
  validates :attendance_kind_id, presence: true
  validates :subfamily, presence: true
  validates :execution, presence: true
  validates :validity, presence: true
  validates :reason, length: { maximum: Rails.configuration.settings.max_reason_length }
  validates :approval_comment, length: { maximum: Rails.configuration.settings.max_comment_length }
  # TODO: validates 今回は、デモ用サンプルなので以下割愛

  def update_with_members!(attributes)
    new_employees = attributes[:attendance_members_attributes].empty? ? {} : attributes[:attendance_members_attributes].index_by { |it| it[:employee_id] }
    current_emploees = attendance_members.index_by { |it| it[:employee_id] }

    new_employees.each { |key, value| value[:id] = current_emploees[key][:id] if current_emploees.key?(key) }
    current_emploees.each do |key, value|
      attributes[:attendance_members_attributes] << ActionController::Parameters.new(id: value[:id], _destroy: '1').permit! unless new_employees.key?(key)
    end
    update!(attributes)
  end
end
