# 勤怠申請種別コントローラー
class Api::V1::AttendanceKindsController < ApiController
  skip_before_action :authenticated?, only: :index

  # GET /attendanceKinds
  def index
    render json: AttendanceKindResource.new(AttendanceKind.whole).serialize, status: :ok
  end
end
