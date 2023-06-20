Rails.application.routes.draw do
  concern :alternative_get_with_body do
    post 'search', on: :collection
  end

  namespace :api do
    namespace :v1 do
      resource :session, only: Rails.env.production? ? %i[create destroy] : %i[show create destroy], format: :json
      resources :labels, only: :index, format: :json
      resources :messages, only: :index, format: :json
      resources :categories, only: :index, format: :json
      resources :attendance_kinds, only: :index, format: :json
      resources :approvers, only: %i[index], format: :json
      namespace :attendances do
        resources :self, only: %i[show new create edit update], concerns: :alternative_get_with_body, id: /\d+/, format: :json
        resources :representative, only: %i[show new create edit update], concerns: :alternative_get_with_body, id: /\d+/, format: :json
        resources :approval, only: %i[show edit update], concerns: :alternative_get_with_body, id: /\d+/, format: :json
      end
    end
  end
end
