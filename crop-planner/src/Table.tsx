import { PureComponent } from 'react'
import { sortBy } from 'lodash'

import CropSelect from './CropSelect'
import {
  Crop,
  Field,
  SeasonalCrop,
  HumusBalances,
  HumusBalancesError,
  HumusBalancesResponse,
} from './types'
import {calculateHumusBalance, fetchCrops, fetchFields} from './api'
import buildNewFieldsState from './buildNewFieldsState'
import HumusBalanceComponent from './HumusBalance'

type Props = {}

type State = {
  allCrops: Array<Crop>,
  fields: Array<Field>,
  humusBalances: HumusBalances,
  error: string | null,
}

export default class Table extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      allCrops: [],
      fields: [],
      humusBalances: {},
      error: null
    }
  }

  componentDidMount = async () => {
    const fields = await fetchFields();
    const allCrops = await fetchCrops();

    await this.requestNewHumusBalanceForFields(fields);

    this.setState({
      fields,
      allCrops,
    });
  }

  requestNewHumusBalanceForFields = async (fields: Array<Field> | undefined) => {
    if (!fields || !fields.length) return;

    try {
      const humusBalancesResponse: HumusBalancesResponse = await calculateHumusBalance(
        fields.map(field => ({
          field_id: field.id,
          crop_values: sortBy(field.crops, crop => crop.year)
            .map((crop: SeasonalCrop) => crop && crop.crop ? crop.crop.value : 0)
        }))
      );

      let assignableHumusBalances: HumusBalances = {};

      humusBalancesResponse.humus_balances.forEach(hb => {
        assignableHumusBalances[hb.field_id] = {
          ...hb,
          humus_balance: +hb.humus_balance // Cast to number
        };
      });

      this.setState({
        humusBalances: {
          ...this.state.humusBalances,
          ...assignableHumusBalances,
        },
        error: null,
      });
    } catch (e) {
      const humusBalancesError: HumusBalancesError = e;

      this.setState({
        error: humusBalancesError.message,
      });
    }
  }

  render = () =>
    <div className="table">

      <div className="table__row table__row--header">
        <div className="table__cell">Field name</div>
        <div className="table__cell table__cell--right">Field area (ha)</div>
        <div className="table__cell table__cell--center">2020 crop</div>
        <div className="table__cell table__cell--center">2021 crop</div>
        <div className="table__cell table__cell--center">2022 crop</div>
        <div className="table__cell table__cell--center">2023 crop</div>
        <div className="table__cell table__cell--center">2024 crop</div>
        <div className="table__cell table__cell--right">Humus balance</div>
      </div>

      {sortBy(this.state.fields, field => field.name).map(field => this.renderFieldRow(field))}
    </div>

  renderFieldRow = (field: Field) =>
    <div className="table__row" key={field.id}>
      <div className="table__cell">{field.name}</div>
      <div className="table__cell table__cell--right">{field.area}</div>

      {sortBy(field.crops, crop => crop.year).map(seasonalCrop => this.renderCropCell(field, seasonalCrop))}

      <HumusBalanceComponent
        className="table__cell table__cell--right"
        humusBalance={this.getHumusBalanceByFieldId(field.id)}
      />
    </div>

  renderCropCell = (field: Field, seasonalCrop: SeasonalCrop) =>
    <div className="table__cell table__cell--center table__cell--with-select" key={seasonalCrop.year}>
      <CropSelect
        selectedCrop={seasonalCrop.crop}
        allCrops={this.state.allCrops}
        onChange={newCrop => this.changeFieldCrop(newCrop, field.id, seasonalCrop.year)}
      />
    </div>

  changeFieldCrop = (newCrop: Crop | null, fieldId: number, cropYear: number) => {
    this.setState(
      buildNewFieldsState(this.state.fields, newCrop, fieldId, cropYear),
      async () => {
        const field = this.state.fields.find(field => field.id === fieldId);
        if (field) await this.requestNewHumusBalanceForFields([field])
      }
    )
  }

  getHumusBalanceByFieldId = (field_id: number): number | undefined => {
    const {humusBalances} = this.state;
    const humusBalance = humusBalances[field_id];
    return humusBalance && humusBalance.humus_balance;
  }
}
