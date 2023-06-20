# ActiveSupport::CurrentAttributes の使用は、賛否両論あると思いますが、
# 「簡単さ」を優先して採用しました。

class LanguageContext < ActiveSupport::CurrentAttributes
  attribute :value

  def value
    attributes[:value] ||= Setting.default_language
  end
end
