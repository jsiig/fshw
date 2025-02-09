import {mount, shallow} from 'enzyme'

import Table from './Table'
import {calculateHumusBalance, fetchCrops, fetchFields} from './api'

jest.mock('./api')

describe('<Table />', () => {
  const crops = [{ value: 1, label: 'Crop 1', humus_delta: 1 }]
  const fields = [
    {
      id: 1,
      name: 'Mäeotsa',
      area: 0.93,
      crops: [
        { year: 2020, crop: { value: 1, label: 'Crop 1', humus_delta: 1 } },
        { year: 2021, crop: { value: 2, label: 'Crop 2', humus_delta: 1 } },
        { year: 2022, crop: { value: 3, label: 'Crop 3', humus_delta: 1 } },
        { year: 2023, crop: { value: 4, label: 'Crop 4', humus_delta: 1 } },
        { year: 2024, crop: { value: 5, label: 'Crop 5', humus_delta: 1 } },
      ],
    },
  ]

  beforeEach(() => {
    fetchCrops.mockReturnValue(crops)
    fetchFields.mockReturnValue(fields)
    calculateHumusBalance.mockReturnValue({
      error: false,
      humus_balances: [
        {
          field_id: 9999,
          humus_balance: 12.345
        },
        {
          field_id: 777,
          humus_balance: 33.333
        },
        {
          field_id: 1,
          humus_balance: 3.14159
        },
      ]
    })
  })

  it('renders with empty data', async () => {
    expect(await shallow(<Table />)).toMatchSnapshot()
  })

  it('loads and displays data when component mounted', async () => {
    const tableComponent = await mount(<Table />)
    await tableComponent.instance().componentDidMount()
    await tableComponent.update()
    expect(tableComponent).toMatchSnapshot()
    expect(tableComponent.contains('3.14')).toBeTruthy()
    expect(tableComponent.contains('3.14159')).toBeFalsy()
  })
})
