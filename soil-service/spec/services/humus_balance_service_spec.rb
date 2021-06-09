require 'rails_helper'

RSpec.describe HumusBalanceService do
  describe 'single field' do
    describe '#calculate' do
      let(:crop1) { { value: 1, label: 'TestCropLabel', humus_delta: 2 } }
      let(:crop2) { { value: 2, label: 'TestCropLabel2', humus_delta: -3 } }
      subject { HumusBalanceService }

      describe 'same consecutive crops' do
        let(:field) { { field_id: 1, crop_values: [1, 1, 1, 2, 2] } }

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
          allow_any_instance_of(subject).to receive(:crops_for).and_return(crops)
        end

        it 'calculates deltas' do
          expect(subject.new(field).calculate).to eq([{ field_id: 1, humus_balance: 1.08 }])
        end
      end

      describe 'unique consecutive crops' do
        let(:field) { { field_id: 2, crop_values: [1, 2] } }
        let(:crops) {
          [
            crop1.to_h.deep_dup,
            crop2.to_h.deep_dup,
          ]
        }

        before(:each) do
          # Mock out crops as these are found in service
          allow_any_instance_of(subject).to receive(:crops_for).and_return(crops)
        end

        it 'calculates deltas' do
          expect(subject.new(field).calculate).to eq([{ field_id: 2, humus_balance: -1 }])
        end
      end
    end
  end

  describe 'with multiple fields' do
    describe '#calculate' do
      let(:crop1) { { value: 1, label: 'TestCropLabel', humus_delta: 2 } }
      let(:crop2) { { value: 2, label: 'TestCropLabel2', humus_delta: -3 } }
      let(:crop3) { { value: 3, label: 'TestCropLabel3', humus_delta: 1 } }
      subject { HumusBalanceService }

      describe 'same consecutive crops' do
        let(:field1) { { field_id: 1, crop_values: [1, 1, 1, 2, 2] } }
        let(:field2) { { field_id: 2, crop_values: [1, 2, 2, 3, 3] } }

        let(:crops1) {
          [
            crop1.to_h.deep_dup,
            crop1.to_h.deep_dup,
            crop1.to_h.deep_dup,
            crop2.to_h.deep_dup,
            crop2.to_h.deep_dup,
          ]
        }

        let(:crops2) {
          [
            crop1.to_h.deep_dup,
            crop2.to_h.deep_dup,
            crop2.to_h.deep_dup,
            crop3.to_h.deep_dup,
            crop3.to_h.deep_dup,
          ]
        }

        before(:each) do
          # Mock out crops as these are found in another service
          allow_any_instance_of(subject).to receive(:crops_for).with(field1).and_return(crops1)
          allow_any_instance_of(subject).to receive(:crops_for).with(field2).and_return(crops2)
        end

        it 'calculates deltas' do
          expect(subject.new(field1, field2).calculate).to eq(
            [
              { field_id: 1, humus_balance: 1.08 },
              { field_id: 2, humus_balance: -2.6 },
            ]
          )
        end
      end

      describe 'unique consecutive crops' do
        let(:field1) { { field_id: 3, crop_values: [1, 2] } }
        let(:field2) { { field_id: 4, crop_values: [2, 3] } }

        let(:crops1) {
          [
            crop1.to_h.deep_dup,
            crop2.to_h.deep_dup,
          ]
        }

        let(:crops2) {
          [
            crop2.to_h.deep_dup,
            crop3.to_h.deep_dup,
          ]
        }

        before(:each) do
          # Mock out crops as these are found in another service
          allow_any_instance_of(subject).to receive(:crops_for).with(field1).and_return(crops1)
          allow_any_instance_of(subject).to receive(:crops_for).with(field2).and_return(crops2)
        end

        it 'calculates deltas' do
          expect(subject.new(field1, field2).calculate).to eq(
            [
              { field_id: 3, humus_balance: -1 },
              { field_id: 4, humus_balance: -2 },
            ]
          )
        end
      end
    end
  end
end
