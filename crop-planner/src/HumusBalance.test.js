import { shallow } from 'enzyme'

import HumusBalance from './HumusBalance'
import { fetchCrops, fetchFields } from './api'

describe('<HumusBalance />', () => {
  const humusBalance = 2;

  it('renders', async () => {
    expect(await shallow(<HumusBalance humusBalance={humusBalance} />)).toMatchSnapshot()
  });
});
