# 攻撃者に情報を与えないため、クライアントに送るエラーメッセージはシンプルにする。
# 検証を Model まで遅らせない。不正なリクエストは、門前払いする。
# 社員コンボボックス等でログインIDを晒さないようにログインIDとは別の選択IDを使用する。
# eager_load と find/find_by/where[first/take] の組み合わせは、SQL が2回発生する。
# (レコード存在確認の SQL が発生し、次にレコードを取得する SQL が発生する。)

# 自己申請コントローラー
class Api::V1::Attendances::SelfController < ApiController
  include Api::V1::Attendances::Validator
  include Api::V1::Attendances::Criteria
  include Api::V1::Attendances::Parameter
  include Api::V1::Attendances::Applicant

  # 検索 POST /attendances/self/search
  def search
    error_handler(validate_search_params, :fail_attendance_fetch)

    criteria = create_search_criteria.merge({ attendance_members: { employee_id: current_employee.id } })

    attendances = Attendance.eager_load(%i[approver employees])
      .where(criteria)
      .order(begin_date: :desc, id: :desc)

    status = :ok
    body = AttendanceResource.new(attendances).serialize
  rescue StandardError => e
    logger.error %(ERROR: #{e.full_message})
    status = :bad_request
    body = { message: Message.value(:fail_attendance_fetch) }
  ensure
    render(json: body, status:)
    set_csrf_token_header
  end

  # 参照用取得 GET /attendances/self/[id]
  def show
    show_edit(:show)
  end

  # 作成 GET /attendances/self/new
  def new
    attendance = Attendance.new.tap do |it|
      it.attendance_kind_id = settings.kind[:paid_holiday]
      it.status = settings.status[:making]
      it.subfamily = settings.subfamily[:plan]
      it.execution = settings.execution[:notYet]
      it.employees << current_employee
      it.applicants = self_applicants(it)
    end

    status = :ok
    body = AttendanceResource.new(attendance).serialize
  rescue StandardError => e
    logger.error %(ERROR: #{e.full_message})
    status = :bad_request
    body = { message: Message.value(:fail_attendance_new) }
  ensure
    render(json: body, status:)
    set_csrf_token_header
  end

  # 更新用取得 GET /attendances/self/[id]/edit
  def edit
    show_edit(:edit)
  end

  # 新規保存（作成／申請） POST /attendances/self
  def create
    error_handler(validate_attendance_params.presence || validate_self_params, :fail_attendance_register)
    error_handler(making? ? validate_new_attendance_params : validate_new_apply_attendance_params, :fail_attendance_register)

    attendance_params = create_attendance_params
    attendance_params[:application_date] = Time.zone.today if applying?

    attendance = Attendance.create!(attendance_params).tap do |it|
      it.applicants = self_applicants(it)
    end

    status = :ok
    body = AttendanceResource.new(attendance).serialize
  rescue StandardError => e
    logger.error %(ERROR: #{e.full_message})
    status = :bad_request
    body = { message: Message.value(:fail_attendance_register) }
  ensure
    render(json: body, status:)
    set_csrf_token_header
  end

  # 更新（編集／申請） PUT /attendances/self/[id]
  def update
    error_handler(validate_attendance_params.presence || validate_self_params, :fail_attendance_register)
    error_handler(making? ? validate_update_attendance_params : validate_update_apply_attendance_params, :fail_attendance_register)

    attendance_params = create_attendance_params
    attendance_params[:application_date] = Time.zone.today if applying?

    criteria = { id: attendance_params[:id], attendance_members: { employee_id: current_employee.id } }

    attendance = Attendance.eager_load(%i[approver employees])
      .where(criteria)
      .then { |it| it.present? ? it[0] : raise(Message.value(:no_attendance)) }
      .tap do |it|
        it.update_with_members!(attendance_params)
        it.reload
        it.applicants = self_applicants(it)
      end

    status = :ok
    body = AttendanceResource.new(attendance).serialize
  rescue StandardError => e
    logger.error %(ERROR: #{e.full_message})
    message_id = e.is_a?(ActiveRecord::StaleObjectError) ? :fail_optimistic_lock : :fail_attendance_register
    status = :bad_request
    body = { message: Message.value(message_id) }
  ensure
    render(json: body, status:)
    set_csrf_token_header
  end

  private

  # 参照／更新用取得 GET /attendances/self/[id] | [id]/edit
  def show_edit(action)
    error_handler(validate_require_id_param, :fail_attendance_fetch)

    criteria = create_id_criteria.merge({ attendance_members: { employee_id: current_employee.id } })
    criteria.merge({ status: settings.status[:making] }) if action == :edit

    attendance = Attendance.eager_load(%i[approver employees])
      .where(criteria)
      .then { |it| it.present? ? it[0] : raise(Message.value(:no_attendance)) }
      .tap { |it| it.applicants = self_applicants(it) }

    status = :ok
    body = AttendanceResource.new(attendance).serialize
  rescue StandardError => e
    logger.error %(ERROR: #{e.full_message})
    status = :bad_request
    body = { message: Message.value(:fail_attendance_fetch) }
  ensure
    render(json: body, status:)
    set_csrf_token_header
  end
end
