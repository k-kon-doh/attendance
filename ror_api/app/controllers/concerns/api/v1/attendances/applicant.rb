# 候補者
module Api::V1::Attendances::Applicant
  extend ActiveSupport::Concern

  private

  # 自己申請・候補者（[作成, 更新, 参照]用）（自分のみ）
  def self_applicants(attendance)
    employee = attendance.employees[0] || current_employee
    organizations = Organization.family(employee.organization_id)
    choices = Hash.new(true)
    format_applicants(organizations, [employee], choices)
  end

  # 代理申請・候補者（[作成, 更新]用）
  def edit_applicants(attendance)
    organizations = Organization.progenies(current_employee.organization_id)
    candidates = Employee.find_candidate(organizations.map(&:id))
    choices = Hash.new(false).tap { |hash| attendance.employees.each { |it| hash[it.id] = true } }
    format_applicants(organizations, candidates, choices)
  end

  # 代理申請／申請承認・候補者（参照用）
  def show_applicants(attendance)
    return [] if attendance.employees.empty?

    organizations = Organization.family(attendance.employees[0].organization_id)
    choices = Hash.new(true)
    format_applicants(organizations, attendance.employees, choices)
  end

  # 候補者フォーマット
  def format_applicants(organizations, employees, choices)
    organization_id_employees = Hash.new { |hash, key| hash[key] = [] }
    organization_id_num_of_employees = Hash.new { |hash, key| hash[key] = 0 }
    employees.each do |it|
      organization_id_employees[it.organization_id] << it
      organization_id_num_of_employees[it.organization_id] += 1
    end

    organizations.reverse_each do |it|
      organization_id_num_of_employees[it.upper_organization_id] += organization_id_num_of_employees[it.id] unless it.upper_organization_id.nil?
    end

    [].tap do |entries|
      organizations.each do |organization|
        next if organization_id_num_of_employees[organization.id].zero?

        entries << { hierarchy: organization.hierarchy, organization: organization.localized_name, choice_id: '', name: '', choice: false }
        organization_id_employees[organization.id].each do |it|
          entries << { hierarchy: organization.hierarchy, organization: organization.localized_name, choice_id: it.choice_id, name: it.localized_name, choice: choices[it.id] }
        end
      end
    end
  end
end
