import React from 'react';
import { shallow } from 'enzyme';

import TCompForm from './TCompForm.component';

describe('TCompForm', () => {
	it('should render', () => {
		const wrapper = shallow(
			<TCompForm />
		);
		expect(wrapper.getElement()).toMatchSnapshot();
	});
});
