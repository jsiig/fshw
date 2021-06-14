require 'rails_helper'

RSpec.describe HumusBalanceController do
  let(:humus_balance_service) { double(calculate: 3) }

  describe 'POST calculate' do
    before(:each) do
      allow(subject).to receive(:humus_balance_service).and_return(humus_balance_service)
    end

    it 'calls HumusBalanceService for calculation' do
      expect(humus_balance_service).to receive(:calculate).and_return(3)

      post :calculate
    end
  end
end
