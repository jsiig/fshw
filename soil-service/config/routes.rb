Rails.application.routes.draw do
  resources :fields, only: [:index]
  resources :crops, only: [:index]
  post :humus_balance, to: "humus_balance#calculate"
end
