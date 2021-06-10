import {Crop, Field, HumusBalancesResponse, FieldsWithCropValues} from './types'

const SOIL_SERVICE_URL = 'http://localhost:3000'

export const fetchFields = async (): Promise<Array<Field>> =>
  await fetch(`${SOIL_SERVICE_URL}/fields`).then(response => response.json())

export const fetchCrops = async (): Promise<Array<Crop>> =>
  await fetch(`${SOIL_SERVICE_URL}/crops`).then(response => response.json())

export const calculateHumusBalance = async (fields_with_crop_values: FieldsWithCropValues): Promise<HumusBalancesResponse> =>
  await fetch(`${SOIL_SERVICE_URL}/humus_balance`, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({fields_with_crop_values})
  }).then(response => response.json())
