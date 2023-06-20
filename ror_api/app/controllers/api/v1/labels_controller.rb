# ラベルコントローラー
class Api::V1::LabelsController < ApiController
  skip_before_action :authenticated?, only: :index

  # GET /labels
  def index
    render json: Label.whole, status: :ok
  end
end
