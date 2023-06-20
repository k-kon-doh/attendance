# 検索条件
module Api::V1::Attendances::Criteria
  extend ActiveSupport::Concern

  private

  # リクエストの申請IDから検索条件を生成
  def create_id_criteria
    { id: params[:id].to_i }
  end

  # リクエストの抽出条件から検索条件を生成
  def create_search_criteria
    criteria = {}
    criteria_params = params.require(:criteria)
    criteria[:status] = criteria_params[:status].strip if criteria_params[:status].present?
    criteria[:attendance_kind_id] = criteria_params[:kind].strip if criteria_params[:kind].present?
    criteria[:begin_date] = criteria_params[:date].strip if criteria_params[:date].present?
    criteria[:application_date] = criteria_params[:applicationDate].strip if criteria_params[:applicationDate].present?
    criteria
  end
end
