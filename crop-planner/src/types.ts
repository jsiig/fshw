export type Crop = { value: number, label: string }

export type SeasonalCrop = {
  year: number,
  crop: Crop | null
}

export type Field = {
  id: number,
  name: string,
  area: number,
  crops: Array<SeasonalCrop>
}

export type HumusBalance = {
  field_id: number,
  humus_balance: number
}

export type HumusBalances = {
  [key: number]: HumusBalance
}

export type HumusBalancesResponseArray = Array<HumusBalance>

export type HumusBalancesResponse = {
  humus_balances?: HumusBalancesResponseArray,
  error: boolean,
  message?: string,
}

export type FieldWithCropValues = {
  field_id: number,
  crop_values: Array<number>
}

export type FieldsWithCropValues = Array<FieldWithCropValues>
