# 勤怠情報： 社員
class PartialEmployeeResource < ApplicationResource
  transform_keys :lower_camel
  on_nil { '' }
  attributes :choice_id
  attribute :name, &:localized_name
end
