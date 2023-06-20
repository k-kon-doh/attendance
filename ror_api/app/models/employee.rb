# 社員
class Employee < ApplicationRecord
  include Localization

  belongs_to :organization

  has_many :attendance_members, dependent: nil
  has_many :attendances, through: :attendance_members

  has_many :employee_set_members, dependent: nil
  has_many :employee_sets, through: :employee_set_members

  has_many :agent_attendances, class_name: 'Attendance', foreign_key: 'agent_id', inverse_of: 'agent', dependent: nil
  has_many :approver_attendances, class_name: 'Attendance', foreign_key: 'approver_id', inverse_of: 'approver', dependent: nil

  belongs_to :role, dependent: nil
  has_many :role_features, primary_key: 'role_id', foreign_key: 'role_id', inverse_of: false, dependent: nil

  has_secure_password

  localize_attribute :name

  # 認証
  def auth(password)
    result = authenticate(password)
    unless result
      self[:n_of_login_failes] += 1
      save
    end
    result
  end

  # 指定組織内で承認可能な社員
  def self.find_approver(organization_ids)
    approve = Rails.configuration.settings.feature[:code][:approve]
    Employee.joins(:role_features).where(organization_id: organization_ids, role_features: { feature: approve }).order(no: :asc)
  end

  # 指定組織内で申請可能な社員
  def self.find_candidate(organization_ids)
    self_apply = Rails.configuration.settings.feature[:code][:selfApply]
    Employee.joins(:role_features).where(organization_id: organization_ids, role_features: { feature: self_apply }).order(no: :asc)
  end

  # 有効な choice_id をカウント
  def self.num_of_valid_choice_ids(choice_ids)
    return 0 if choice_ids.empty?

    Employee.where(choice_id: choice_ids).count
  end

  # choice_id から id を取得
  def self.id_of_choice_id(choice_id)
    return [] if choice_id.blank?

    Employee.where(choice_id:).pluck(:id)
  end
end
