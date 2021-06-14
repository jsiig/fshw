class HumusBalanceService
  attr_reader :crop_fields

  BIGDECIMAL_PRECISION = 6 # 6 significant digits should be precise enough
  CONSECUTIVE_MULTIPLIER = 1.3
  INITIAL_HUMUS_BALANCE = 0

  def initialize(*crop_fields)
    @crop_fields = crop_fields
  end

  def calculate
    crop_fields.map do |field|
      crops = crops_for field
      crop_deltas = crop_deltas_for crops
      humus_balance = humus_balance_for crop_deltas

      {
        field_id: field[:field_id],
        humus_balance: humus_balance,
      }
    end
  end

  private

  def crops_for(field)
    field[:crop_values].map { |crop_value|
      crops_service.get_crop(crop_value).to_h.deep_dup
    }
  end

  def crop_deltas_for(crops)
    crops.each_with_index.map { |crop, index|
      previous_crop = crops[index - 1]
      current_crop = crop

      # Cast to BigDecimal
      current_crop[:humus_delta] = as_bigdecimal(current_crop[:humus_delta])

      # In cases of consecutively same crop
      # humus delta should be multiplied by consecutive multiplier (1.3)
      if previous_crop[:value] == current_crop[:value]
        current_crop[:humus_delta] = previous_crop[:humus_delta] * as_bigdecimal(CONSECUTIVE_MULTIPLIER)
      end

      current_crop
    }
  end

  def humus_balance_for(crop_deltas)
    crop_deltas.inject(INITIAL_HUMUS_BALANCE) { |sum, crop|
      sum + crop[:humus_delta]
    }
  end

  def crops_service
    @crops_service ||= CropsService.instance
  end

  def as_bigdecimal(value)
    BigDecimal(value, BIGDECIMAL_PRECISION)
  end
end
