class HumusBalanceController < ActionController::Base
  skip_before_action :verify_authenticity_token, only: [:calculate]

  def calculate
    render json: {
      error: false,
      humus_balances: humus_balance_service.calculate,
    }, status: 200
  rescue CropNotFoundError
    render json: {
      error: true,
      message: 'Crop not found',
    }, status: 404
  end

  private
  def humus_balance_params
    params.require(:fields_with_crop_values)
  end

  def humus_balance_service
    HumusBalanceService.new(*humus_balance_params)
  end
end
