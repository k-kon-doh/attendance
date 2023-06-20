# メッセージコントローラー
class Api::V1::MessagesController < ApiController
  skip_before_action :authenticated?, only: :index

  # GET /messages
  def index
    render json: Message.whole, status: :ok
  end
end
