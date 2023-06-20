# 今回はトークンではなく、セッションによる簡易認証にしました。

# 認証
module Authentication
  extend ActiveSupport::Concern

  included do
    before_action :authenticated?
  end

  # ログイン中の社員を取得
  def current_employee
    @current_employee ||= Employee.eager_load(%i[organization role_features]).where(id: session[:current_employee]).then { |it| it[0] if it.present? }
  end

  private

  # ログイン中か確認
  def authenticated?
    render json: { message: Message.value(:not_login) }, status: :unauthorized unless current_employee
  end

  # ログイン
  def login(employee)
    @current_employee = employee
    session[:current_employee] = employee.id
  end
end
