# 今回は、I18n を使用せずDBから各言語リソースを取得する形にしました。
# とりあえず、言語は HTTP_ACCEPT_LANGUAGE からのみ取得し、簡易判定としました。
# 繁体字、簡体字などの地域性のある言語が必要な場合は修正が必要です。

# 言語
module Language
  extend ActiveSupport::Concern

  included do
    before_action :set_language_context
  end

  private

  # 言語コンテキストにリクエストヘッダーの言語を設定
  def set_language_context
    language = request.env['HTTP_ACCEPT_LANGUAGE']&.scan(/^[a-z]{2}/)&.first
    language = Setting.default_language unless Setting.available_languages.include?(language)
    LanguageContext.value = language
  end
end
