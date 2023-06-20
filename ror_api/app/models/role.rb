# 役割
class Role < ApplicationRecord
  include Localization

  has_many :role_features, dependent: :destroy
  has_many :employees, dependent: nil

  localize_attribute :name
end
