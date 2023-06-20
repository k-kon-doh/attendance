# リスエストの申請情報用バリデーター
module Api::V1::Attendances::Validator
  extend ActiveSupport::Concern

  private

  # 作成中か確認
  def making?
    params['attendance']['status'] == settings.status[:making]
  end

  # 申請中か確認
  def applying?
    params['attendance']['status'] == settings.status[:applying]
  end

  # 承認済みか確認
  def accepted?
    params['attendance']['status'] == settings.status[:accepted]
  end

  # 却下済みか確認
  def rejected?
    params['attendance']['status'] == settings.status[:rejected]
  end

  # 値の検証

  def validate_integer(value)
    value =~ /^\d+$/
  end

  def validate_date(value)
    !value.to_date.nil?
  rescue ArgumentError
    false
  end

  def validate_time(value)
    hour, minute = /^(\d{2}):(\d{2})$/.match(value).to_a.values_at(1, 2)
    !hour.nil? && !minute.nil? && '00' <= hour && hour <= settings.max_time[:hour] && '00' <= minute && minute <= settings.max_time[:minute]
  end

  # 個別要素の検証

  def validate_id_param(value)
    return true if value.nil? # 新規作成
    return true if value.is_a?(Integer) # Body指定
    return true if value.is_a?(String) && value.present? && validate_integer(value) # URL指定

    false
  end

  def validate_search_kind_param(value)
    value.is_a?(String) && (value.blank? || !AttendanceKind.value(value.to_i).nil?)
  end

  def validate_search_category_param(keyword, value)
    value.is_a?(String) && (value.blank? || !Category.member(keyword, value).nil?)
  end

  def validate_search_date_param(value)
    value.nil? || value.is_a?(String) && (value.blank? || validate_date(value))
  end

  def validate_kind_param(value)
    value.is_a?(Integer) && value.present? && !AttendanceKind.value(value.to_i).nil?
  end

  def validate_category_param(keyword, value, required: false)
    return false if value.blank? && required

    value.is_a?(String) && (value.blank? || !Category.member(keyword, value).nil?)
  end

  def validate_date_param(value)
    value.nil? || (value.is_a?(String) && (value.blank? || validate_date(value)))
  end

  def validate_time_param(value)
    value.is_a?(String) && (value.blank? || validate_time(value))
  end

  def validate_reason_param(value)
    value.is_a?(String) && value.length <= settings.max_reason_length
  end

  def validate_comment_param(value)
    value.is_a?(String) && value.length <= settings.max_comment_length
  end

  def validate_related_id_param(value)
    value.nil? || value.is_a?(Integer)
  end

  def validate_lock_version_param(value)
    value.present? && value.is_a?(Integer)
  end

  def validate_choice_id_param(value)
    value.is_a?(String)
  end

  def validate_choice_param(value)
    [true, false].include?(value)
  end

  # 構造の検証

  def validate_employee_param(value)
    value.is_a?(Hash) && value.keys == settings.attendance[:employee]
  end

  def validate_employees_param(value)
    value.is_a?(Array)
  end

  def validate_applicant_param(value)
    value.is_a?(Hash) && value.keys == settings.attendance[:applicant]
  end

  def validate_applicants_param(value)
    value.is_a?(Array)
  end

  # 機能検証パーツ

  def validate_require_id_param
    return ['id: null'] if params[:id].nil?
    return ['id: invalid'] unless params[:id].is_a?(String)

    []
  end

  def validate_null_id_param
    params[:id].nil? ? [] : ['id: not null']
  end

  def validate_attendance_params
    attendance = params.permit!.to_hash['attendance']
    attendance_keys = attendance.is_a?(Hash) && attendance.keys
    return ['attendance: non or invalid'] unless attendance && attendance_keys && attendance_keys == settings.attendance[:key]

    [].tap do |errors|
      errors << 'attendance.id: invalid' unless validate_id_param(attendance['id'])
      errors << 'attendance.attendanceKindId: invalid' unless validate_kind_param(attendance['attendanceKindId'])
      errors << 'attendance.status: invalid' unless validate_category_param('attendance_status', attendance['status'], required: true)
      errors << 'attendance.subfamily: invalid' unless validate_category_param('attendance_subfamily', attendance['subfamily'], required: true)
      errors << 'attendance.execution: invalid' unless validate_category_param('attendance_execution', attendance['execution'], required: true)
      errors << 'attendance.beginDate: invalid' unless validate_date_param(attendance['beginDate'])
      errors << 'attendance.beginTime: invalid' unless validate_time_param(attendance['beginTime'])
      errors << 'attendance.endDate: invalid' unless validate_date_param(attendance['endDate'])
      errors << 'attendance.endTime: invalid' unless validate_time_param(attendance['endTime'])
      errors << 'attendance.shift: invalid' unless validate_category_param('shift', attendance['shift'], required: false)
      errors << 'attendance.reason: invalid' unless validate_reason_param(attendance['reason'])
      errors << 'attendance.applicationDate: invalid' unless validate_date_param(attendance['applicationDate'])
      errors << 'attendance.approvalDate: invalid' unless validate_date_param(attendance['approvalDate'])
      errors << 'attendance.approvalComment: invalid' unless validate_comment_param(attendance['approvalComment'])
      errors << 'attendance.relatedId: invalid' unless validate_id_param(attendance['relatedId'])
      errors << 'attendance.validity: invalid' unless validate_category_param('validity', attendance['validity'], required: true)
      errors << 'attendance.lockVersion: invalid' unless validate_lock_version_param(attendance['lockVersion'])
      errors << 'attendance.employees: invalid' unless validate_employees_param(attendance['employees'])
      if validate_employee_param(attendance['agent'])
        errors << 'attendance.agent.choiceId: invalid' unless validate_choice_id_param(attendance['agent']['choiceId'])
      else
        errors << 'attendance.agent: invalid'
      end
      if validate_employee_param(attendance['approver'])
        errors << 'attendance.approver.choiceId: invalid' unless validate_choice_id_param(attendance['approver']['choiceId'])
      else
        errors << 'attendance.approver: invalid'
      end
      if validate_applicants_param(attendance['applicants'])
        choice_ids = []
        attendance['applicants'].each_with_index do |it, index|
          if validate_applicant_param(it)
            error_count = errors.size
            errors << "attendance.applicants[#{index}].choiceId: invalid" unless validate_choice_id_param(it['choiceId'])
            errors << "attendance.applicants[#{index}].choice: invalid" unless validate_choice_param(it['choice'])
            choice_ids << it['choiceId'] if error_count == errors.size && it['choiceId'].present? && it['choice']
          else
            errors << "attendance.applicants[#{index}]: invalid"
          end
        end
        errors << 'attendance.applicants.choiceId: invalid' if choice_ids.size != Employee.num_of_valid_choice_ids(choice_ids)
      else
        errors << 'attendance.applicants: invalid'
      end
    end
  end

  def validate_before_apply_params
    [].tap do |errors|
      errors << 'attendance.applicationDate: exist' if params['attendance']['applicationDate'].present?
      errors << 'attendance.approvalDate: exist' if params['attendance']['approvalDate'].present?
      errors << 'attendance.approvalComment: exist' if params['attendance']['approvalComment'].present?
    end
  end

  def validate_before_approve_params
    [].tap do |errors|
      errors << 'attendance.applicationDate: not exist' if params['attendance']['applicationDate'].empty?
      errors << 'attendance.approvalDate: exist' if params['attendance']['approvalDate'].present?
    end
  end

  def validate_making_params
    validate_before_apply_params + [].tap do |errors|
      errors << 'attendance.status: not making' unless making?
    end
  end

  def validate_apply_attendance_params
    validate_before_apply_params + [].tap do |errors|
      errors << 'attendance.status: not applying' unless applying?
      errors << 'attendance.approver: required' if params['attendance']['approver']['choiceId'].blank?
      errors << 'attendance.applicants: not select' unless params['attendance']['applicants'].find { |it| it['choiceId'].present? && it['choice'] }

      kind = AttendanceKind.value(params['attendance']['attendanceKindId'].to_i)
      errors << 'attendance.beginDate: required' if kind.begin_date == settings.necessary[:required] && params['attendance']['beginDate'].blank?
      errors << 'attendance.beginTime: required' if kind.begin_time == settings.necessary[:required] && params['attendance']['beginTime'].blank?
      errors << 'attendance.endDate: required' if kind.end_date == settings.necessary[:required] && params['attendance']['endDate'].blank?
      errors << 'attendance.endTime: required' if kind.end_time == settings.necessary[:required] && params['attendance']['endTime'].blank?
      errors << 'attendance.shift: required' if kind.shift == settings.required[:required] && params['attendance']['shift'].blank?
      errors << 'attendance.reason: required' if kind.reason == settings.required[:required] && params['attendance']['reason'].blank?
    end
  end


  # 検索条件の検証

  def validate_search_params
    criteria = params.permit!.to_hash['criteria']
    criteria_keys = criteria.is_a?(Hash) && criteria.keys
    return ['criteria: non or invalid'] unless criteria && criteria_keys && criteria_keys == settings.criteria[:attendance]

    [].tap do |errors|
      errors << 'criteria.status: invalid' unless validate_search_category_param('attendance_status', criteria['status'])
      errors << 'criteria.attendanceKind: invalid' unless validate_search_kind_param(criteria['kind'])
      errors << 'criteria.date: invalid' unless validate_search_date_param(criteria['date'])
      errors << 'criteria.applicationDate: invalid' unless validate_search_date_param(criteria['applicationDate'])
    end
  end

  # 勤怠情報:機能の検証

  def validate_self_params
    [].tap do |errors|
      applicants = params['attendance']['applicants'].filter_map { |it| it['choiceId'].present? && it['choice'] ? it['choiceId'] : nil }
      errors << 'attendance.agent: exist' if params['attendance']['agent']['choiceId'].present?
      errors << 'attendance.applicants: not select or not self' unless applicants.size == 1 && applicants[0] == current_employee.choice_id
    end
  end

  def validate_agent_params
    [].tap do |errors|
      errors << 'attendance.agent: not me' unless params['attendance']['agent']['choiceId'] == current_employee.choice_id
    end
  end

  def validate_approver_params
    [].tap do |errors|
      errors << 'attendance.approver: not me' unless params['attendance']['approver']['choiceId'] == current_employee.choice_id
    end
  end

  def validate_new_attendance_params
    validate_null_id_param + validate_making_params
  end

  def validate_update_attendance_params
    validate_require_id_param + validate_making_params
  end

  def validate_new_apply_attendance_params
    validate_null_id_param + validate_apply_attendance_params
  end

  def validate_update_apply_attendance_params
    validate_require_id_param + validate_apply_attendance_params
  end

  def validate_accept_attendance_params
    validate_require_id_param + validate_before_approve_params + [].tap do |errors|
      errors << 'attendance.status: not accepted' unless accepted?
    end
  end

  def validate_reject_attendance_params
    validate_require_id_param + validate_before_approve_params + [].tap do |errors|
      errors << 'attendance.status: not rejected' unless rejected?
    end
  end
end
