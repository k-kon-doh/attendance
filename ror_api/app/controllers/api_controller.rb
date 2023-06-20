# APIコントローラー
class ApiController < ApplicationController
  include Authentication
  include Language

  private

  # 設定
  def settings
    Rails.configuration.settings
  end

  # エラーハンドラ
  def error_handler(errors, message_sym)
    if errors.present?
      logger.error "ERROR: #{errors.join(', ')}"
      raise Message.value(message_sym)
    end
  end
end
