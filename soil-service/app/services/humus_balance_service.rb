class HumusBalanceService
  attr_reader :crop_values

  BIGDECIMAL_PRECISION = 6 # 6 significant digits should be precise enough for these calculations
  CONSECUTIVE_MULTIPLIER = 1.3
  INITIAL_HUMUS_BALANCE = 0

  def initialize(*crop_values)
    @crop_values = crop_values
  end

  def calculate
    crops_with_consecutive_deltas.inject(INITIAL_HUMUS_BALANCE) do |sum, crop|
      sum + crop[:humus_delta]
    end
  end

  private

  def crops_service
    @crops_service ||= CropsService.instance
  end

  def crops
    @crops ||= crop_values.map { |crop_value|
      crops_service.get_crop(crop_value).to_h.deep_dup
    }
  end

  def crops_with_consecutive_deltas
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

  def as_bigdecimal(value)
    BigDecimal(value, BIGDECIMAL_PRECISION)
  end
end
