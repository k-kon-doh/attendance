# セッション
class SessionResource < ApplicationResource
  transform_keys :lower_camel

  attributes :choice_id
  attribute :name, &:localized_name
  attribute :organization_name do |it|
    it.organization.localized_name
  end
  attribute :features do |it|
    it.role_features.map(&:feature)
  end
end
