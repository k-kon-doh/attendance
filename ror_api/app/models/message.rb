# メッセージ
class Message < ApplicationRecord
  include Localization

  localize_attribute :message

  def self.whole(language = LanguageContext.value)
    cache.to_h { |key, value| [key.camelize(:lower), value[language]] }
  end

  def self.value(keyword, language = LanguageContext.value)
    cache[keyword]&.[](language) || "no message #{keyword}, #{language}"
  end

  def self.cache
    Rails.cache.fetch('Message', expires_in: 1.hour) do
      all.to_h do |it|
        [it.keyword, M17nResource.to_resource(it.message).with_indifferent_access]
      end.with_indifferent_access
    end
  end
  private_class_method :cache
end
