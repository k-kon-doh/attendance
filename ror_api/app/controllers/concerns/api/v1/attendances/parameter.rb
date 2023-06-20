# リクエスト・パラメータ
module Api::V1::Attendances::Parameter
  extend ActiveSupport::Concern

  private

  # 申請の新規作成／更新用にストロングパラメータを生成
  def create_attendance_params
    attendance = params.require(:attendance).deep_transform_keys!(&:underscore)

    kind = AttendanceKind.value(attendance[:attendance_kind_id].to_i)
    attendance[:begin_date] = nil if kind.begin_date == settings.necessary[:notNeeded]
    attendance[:begin_time] = '' if kind.begin_time == settings.necessary[:notNeeded]
    attendance[:end_date] = nil if kind.end_date == settings.necessary[:notNeeded]
    attendance[:end_time] = '' if kind.end_time == settings.necessary[:notNeeded]

    attendance[:agent_id] = Employee.id_of_choice_id(attendance[:agent][:choiceId]).then { |it| it[0] if it.present? }
    attendance[:approver_id] = Employee.id_of_choice_id(attendance[:approver][:choiceId]).then { |it| it[0] if it.present? }
    attendance[:attendance_members_attributes] = []
    choice_ids = attendance[:applicants].filter_map { |it| it[:choiceId] if it[:choiceId].present? && it[:choice] }
    Employee.id_of_choice_id(choice_ids).each { |it| attendance[:attendance_members_attributes] << { employee_id: it } }

    attendance.delete(:agent)
    attendance.delete(:approver)
    attendance.delete(:employees)
    attendance.delete(:applicants)

    attendance.permit(
      :id,
      :attendance_kind_id,
      :status,
      :subfamily,
      :execution,
      :begin_date,
      :begin_time,
      :end_date,
      :end_time,
      :shift,
      :reason,
      :application_date,
      :approval_date,
      :approval_comment,
      :related_id,
      :validity,
      :lock_version,
      :agent_id,
      :approver_id,
      { attendance_members_attributes: [:employee_id] }
    )
  end
end
