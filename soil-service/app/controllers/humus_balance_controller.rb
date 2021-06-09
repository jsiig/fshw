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

  def humus_balance_service
    # If we were doing an insert operation, this'd have to use
    # strong params. However, since this is a simple calculation
    # not writing to any DB, this is fine for now.
    HumusBalanceService.new(*params[:fields_with_crop_values])
  end
end
