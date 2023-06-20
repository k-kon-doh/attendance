# 社員セット
class EmployeeSet < ApplicationRecord
  has_many :employee_set_members, dependent: :destroy
  has_many :employees, through: :employee_set_members
end
