# カテゴリーコントローラー
class Api::V1::CategoriesController < ApiController
  skip_before_action :authenticated?, only: :index

  # GET /categories
  def index
    render json: CategoryResource.new(Category.whole).serialize, status: :ok
  end
end
