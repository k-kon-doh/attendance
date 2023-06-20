# TODO: 候補者を抽出する基準
# ログイン社員以上の承認権限を持つ人を候補者としているが、
# 代理申請の場合、対象者も承認者も下位組織のことがある。
# 全承認権限者？／対象者を基準に絞る？

# 承認者コントローラー
class Api::V1::ApproversController < ApiController
  include Api::V1::Attendances::Applicant

  # 承認候補者一覧取得 GET /approvers
  def index
    organizations = Organization.ancestors(current_employee.organization_id)
    approvers = Employee.find_approver(organizations.map(&:id))
    choices = Hash.new(false)

    status = :ok
    body = format_applicants(organizations, approvers, choices).map do |it|
      it.transform_keys { |key| key.to_s.camelize(:lower) }
    end
  rescue StandardError => e
    logger.error %(ERROR: #{e.full_message})
    status = :bad_request
    body = { message: Message.value(:fail_approver_fetch) }
  ensure
    render(json: body, status:)
    set_csrf_token_header
  end
end
