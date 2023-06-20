# 1つの項目に複数言語の文字列を格納しているのでジェイウォークっぽいですが
# 今までこの構成に会ったことがなかったので、試しにやってみました。
# 結論： JSON用またはJSON対応したDBを使うべきでしょうね。外部ツールによるメンテナンスが大変。

# JSON多言語対応
module Localization
  extend ActiveSupport::Concern

  included do
    after_initialize :init_localized_attributes
  end

  module ClassMethods
    def localize(name)
      "localized_#{name}"
    end

    def localize_attributes
      @localize_attributes
    end

    def localize_attribute(*names)
      @localize_attributes = names

      names.each { |name| attribute localize(name).to_sym, :string }

      ActiveSupport::CodeGenerator.batch(Module.new.tap { |mod| include mod }, __FILE__, __LINE__) do |put_in_module|
        names.each do |name|
          localized_name = localize(name)

          # rubocop:disable Style/LineEndConcatenation
          put_in_module.define_cached_method(localized_name, namespace: :localize_attribute) do |sources|
            sources <<
              "def #{localized_name}" <<
              "M17nResource.get(#{localized_name}_resource, LanguageContext.value)" <<
              'end'
          end

          put_in_module.define_cached_method("#{localized_name}=", namespace: :localize_attribute) do |sources|
            sources <<
              "def #{localized_name}=(value)" <<
              "M17nResource.set!(#{localized_name}_resource, value, LanguageContext.value)" <<
              "self[:#{localized_name}] = value" <<
              "self[:#{name}] = M17nResource.to_json(#{localized_name}_resource)" <<
              'end'
          end

          put_in_module.define_cached_method("#{localized_name}_resource", namespace: :localize_attribute) do |sources|
            resource = "#{localized_name}_resource"
            sources <<
              "def #{resource}" <<
              "@#{resource} ||= M17nResource.to_resource(self[:#{name}])" <<
              'end'
          end
          # rubocop:enable Style/LineEndConcatenation
        end
      end
    end
  end

  private

  def localize(name)
    self.class.localize(name)
  end

  def localize_attributes
    self.class.localize_attributes
  end

  def init_localized_attributes
    localize_attributes&.each { |name| self[localize(name).to_sym] = send(localize(name)) }
  end
end
