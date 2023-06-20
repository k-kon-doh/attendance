# セッションコントローラー
class Api::V1::SessionsController < ApiController
  skip_forgery_protection only: :create
  skip_before_action :authenticated?, only: :create

  # ログイン者取得（開発環境のみ）GET /session
  def show
    render json: current_employee
  end

  # ログイン POST /session
  def create
    employee = Employee.eager_load(:organization, :role_features)
      .where(login_id: params[:login_id]).then do |it|
      it.present? ? it[0] : nil
    end

    raise AuthError, Message.value(:invalid_usr_pwd) unless employee
    raise AuthError, Message.value(:locked_out) if Setting.max_failes <= employee.n_of_login_failes
    raise AuthError, Message.value(:invalid_usr_pwd) unless employee.auth(params[:password])

    employee.update(n_of_login_failes: 0, last_login_at: Time.zone.now)
    login(employee)

    status = :ok
    body = SessionResource.new(employee).serialize
    set_csrf_token_header
  rescue AuthError => e
    reset_session
    status = :bad_request
    body = { message: e.message }
  rescue StandardError => e
    logger.error %(ERROR: #{e.full_message})
    status = :bad_request
    body = { message: Message.value(:fail_login) }
  ensure
    render(json: body, status:)
  end

  # ログアウト DELETE /session
  def destroy
    reset_session
    render json: { message: Message.value(:logged_out) }, status: :ok
  end

  class AuthError < StandardError; end
  private_constant :AuthError
end
