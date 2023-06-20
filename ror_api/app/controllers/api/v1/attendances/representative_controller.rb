# 代理申請コントローラー
class Api::V1::Attendances::RepresentativeController < ApiController
  include Api::V1::Attendances::Validator
  include Api::V1::Attendances::Criteria
  include Api::V1::Attendances::Parameter
  include Api::V1::Attendances::Applicant

  # 検索 POST /attendances/representative/search
  def search
    error_handler(validate_search_params, :fail_attendance_fetch)

    criteria = create_search_criteria.merge({ agent_id: current_employee.id })

    attendances = Attendance.eager_load(%i[agent approver employees])
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

  # 参照用取得 GET /attendances/representative/[id]
  def show
    show_edit(:show)
  end

  # 作成 GET /attendances/representative/new
  def new
    attendance = Attendance.new.tap do |it|
      it.attendance_kind_id = settings.kind[:overtime]
      it.status = settings.status[:making]
      it.subfamily = settings.subfamily[:plan]
      it.execution = settings.execution[:notYet]
      it.agent = current_employee
      it.applicants = edit_applicants(it)
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

  # 更新用取得 GET /attendances/representative/[id]/edit
  def edit
    show_edit(:edit)
  end

  # 新規保存（作成／申請） POST /attendances/representative
  def create
    error_handler(validate_attendance_params.presence || validate_agent_params, :fail_attendance_register)
    error_handler(making? ? validate_new_attendance_params : validate_new_apply_attendance_params, :fail_attendance_register)

    attendance_params = create_attendance_params
    attendance_params[:application_date] = Time.zone.today if applying?

    attendance = Attendance.create!(attendance_params).tap do |it|
      it.applicants = making? ? edit_applicants(it) : show_applicants(it)
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

  # 更新（編集／申請） PUT /attendances/representative/[id]
  def update
    error_handler(validate_attendance_params.presence || validate_agent_params, :fail_attendance_register)
    error_handler(making? ? validate_update_attendance_params : validate_update_apply_attendance_params, :fail_attendance_register)

    attendance_params = create_attendance_params
    attendance_params[:application_date] = Time.zone.today if applying?

    attendance = Attendance.eager_load(%i[approver employees])
      .where(id: attendance_params[:id])
      .then { |it| it.present? ? it[0] : raise(Message.value(:no_attendance)) }
      .tap do |it|
        it.update_with_members!(attendance_params)
        it.reload
        it.applicants = making? ? edit_applicants(it) : show_applicants(it)
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

  # 参照／更新用取得 GET /attendances/representative/[id] | [id]/edit
  def show_edit(action)
    error_handler(validate_require_id_param, :fail_attendance_fetch)

    criteria = create_id_criteria.merge({ agent_id: current_employee.id })
    criteria.merge({ status: settings.status[:making] }) if action == :edit

    attendance = Attendance.eager_load(%i[agent approver employees attendance_members])
      .where(criteria)
      .then { |it| it.present? ? it[0] : raise(Message.value(:no_attendance)) }
      .tap { |it| it.applicants = action == :show ? show_applicants(it) : edit_applicants(it) }

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
