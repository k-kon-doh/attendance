# アプリケーションコントローラー
class ApplicationController < ActionController::API
  include ActionController::Cookies
  include ActionController::RequestForgeryProtection

  protect_from_forgery prepend: true, with: :exception

  # クロスサイトリクエストフォージェリ対策用ヘッダーをセット
  def set_csrf_token_header
    response.set_header('X-CSRF-Token', form_authenticity_token)
  end
end
