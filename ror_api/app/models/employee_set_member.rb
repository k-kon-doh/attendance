# 社員セットメンバー
class EmployeeSetMember < ApplicationRecord
  belongs_to :employee_set
  belongs_to :employee
end
