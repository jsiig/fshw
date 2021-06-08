require 'rails_helper'

RSpec.describe HumusBalanceService do
  describe '#calculate' do
    let(:crop1) { { value: 1, label: 'TestCropLabel', humus_delta: 2 } }
    let(:crop2) { { value: 2, label: 'TestCropLabel2', humus_delta: -3 } }

    subject(:service) { described_class }

    describe 'with consecutive crops' do
      let(:crops) {
        [
          crop1.to_h.deep_dup,
          crop1.to_h.deep_dup,
          crop1.to_h.deep_dup,
          crop2.to_h.deep_dup,
          crop2.to_h.deep_dup,
        ]
      }
      before(:each) do
        # Mock out crops as these are found in service
        allow_any_instance_of(subject).to receive(:crops).and_return(crops)
      end

      it 'calculates deltas' do
        expect(subject.new.calculate).to eq(1.08)
      end
    end

    describe 'without consecutive crops' do
      let(:crops) {
        [
          crop1.to_h.deep_dup,
          crop2.to_h.deep_dup,
        ]
      }

      before(:each) do
        # Mock out crops as these are found in service
        allow_any_instance_of(subject).to receive(:crops).and_return(crops)
      end

      it 'calculates deltas' do
        expect(subject.new.calculate).to eq(-1)
      end
    end
  end
end
