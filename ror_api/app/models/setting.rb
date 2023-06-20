# 設定
class Setting < ApplicationRecord
  def self.value(keyword)
    Rails.cache.fetch('Setting', expires_in: 1.hour) do
      all.to_h do |it|
        [it.keyword, it.setting_value]
      end.with_indifferent_access
    end&.[](keyword)
  end

  def self.max_failes
    value(:max_of_login_failes).to_i
  end

  def self.default_language
    lang = value(:default_language)
    lang.presence || Rails.configuration.settings.default_language
  end

  using JsonExt

  def self.available_languages
    default_language = Rails.configuration.settings.default_language
    langs = JSON.try_parse(value(:available_languages))
    langs = [default_language] unless langs.is_a?(Array) && !langs.empty?
    langs.push(default_language) unless langs.include?(default_language)
    langs
  end
end
