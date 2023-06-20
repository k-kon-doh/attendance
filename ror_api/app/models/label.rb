# ラベル
class Label < ApplicationRecord
  include Localization

  localize_attribute :label, :short_label

  def self.whole(language = LanguageContext.value)
    long_labels = {}
    short_labels = {}
    cache.each do |key, value|
      long_labels[key.camelize(:lower)] = value.l[language]
      short_labels[key.camelize(:lower)] = value.s[language]
    end
    { long: long_labels, short: short_labels }
  end

  def self.long(keyword, language = LanguageContext.value)
    cache[keyword]&.l&.[](language) || "no long label(#{keyword}, #{language})"
  end

  def self.short(keyword, language = LanguageContext.value)
    cache[keyword]&.s&.[](language) || "no short label(#{keyword}, #{language})"
  end

  LabelSet = Struct.new('LabelSet', :l, :s)
  private_constant :LabelSet

  def self.cache
    Rails.cache.fetch('Label', expires_in: 1.hour) do
      all.to_h do |it|
        [it.keyword, LabelSet.new(
          M17nResource.to_resource(it.label).with_indifferent_access,
          M17nResource.to_resource(it.short_label).with_indifferent_access
        )]
      end.with_indifferent_access
    end
  end
  private_class_method :cache
end
