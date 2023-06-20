# カテゴリー
class CategoryResource < ApplicationResource
  transform_keys :lower_camel

  attribute :keyword do |it|
    it.keyword.camelize(:lower)
  end
  attributes :code
  attribute :name, &:localized_name
  attribute :short_name, &:localized_short_name
  attributes :show_order
end
