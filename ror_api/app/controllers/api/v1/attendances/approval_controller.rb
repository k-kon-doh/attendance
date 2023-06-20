# 申請承認コントローラー
class Api::V1::Attendances::ApprovalController < ApiController
  include Api::V1::Attendances::Validator
  include Api::V1::Attendances::Criteria
  include Api::V1::Attendances::Parameter
  include Api::V1::Attendances::Applicant

  # 検索 POST /attendances/approval/search
  def search
    error_handler(validate_search_params, :fail_attendance_fetch)

    criteria = create_search_criteria.merge({ approver_id: current_employee.id })

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

  # 参照用取得 GET /attendances/approval/[id]
  def show
    show_edit(:show)
  end

  # 更新用取得 GET /attendances/approval/[id]/edit
  def edit
    show_edit(:edit)
  end

  # 更新（承認／却下） PUT /attendances/approval/[id]
  def update
    error_handler(validate_attendance_params.presence || validate_approver_params, :fail_attendance_register)
    error_handler(accepted? ? validate_accept_attendance_params : validate_reject_attendance_params, :fail_attendance_register)

    attendance_params = create_attendance_params
    attendance_params[:approval_date] = Time.zone.today

    attendance = Attendance.eager_load(%i[agent approver employees])
      .where(id: attendance_params[:id])
      .then { |it| it.present? ? it[0] : raise(Message.value(:no_attendance)) }
      .tap do |it|
        it.update_with_members!(attendance_params)
        it.reload
        it.applicants = show_applicants(it)
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

  # 参照／更新用取得 GET /attendances/approval/[id] | [id]/edit
  def show_edit(action)
    error_handler(validate_require_id_param, :fail_attendance_fetch)

    criteria = create_id_criteria.merge({ approver_id: current_employee.id })
    criteria.merge({ status: settings.status[:making] }) if action == :edit

    attendance = Attendance.eager_load(%i[agent approver employees])
      .where(criteria)
      .then { |it| it.present? ? it[0] : raise(Message.value(:no_attendance)) }
      .tap { |it| it.applicants = show_applicants(it) }

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
