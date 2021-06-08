class HumusBalanceController < ActionController::Base
  skip_before_action :verify_authenticity_token, only: [:calculate]

  def calculate
    render json: {
      error: false,
      humus_balance: humus_balance_service.calculate,
    }, status: 200
  rescue CropNotFoundError
    render json: {
      error: true,
      message: 'Crop not found',
    }, status: 404
  end

  private

  def humus_balance_service
    HumusBalanceService.new(*params[:crop_values])
  end
end
