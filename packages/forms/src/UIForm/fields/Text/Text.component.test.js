import React from 'react';
import { shallow } from 'enzyme';

import Text from './Text.component';

describe('Text field', () => {
	const schema = {
		autoFocus: true,
		description: 'my text input hint',
		placeholder: 'Type something here',
		required: true,
		title: 'My input title',
		type: 'text',
	};

	it('should render input', () => {
		// when
		const wrapper = shallow(
			<Text
				id={'myForm'}
				isValid
				errorMessage={'My error message'}
				onChange={jest.fn()}
				onFinish={jest.fn()}
				schema={schema}
				value={'toto'}
			/>,
		);

		// then
		expect(wrapper.getElement()).toMatchSnapshot();
	});

	it('should render password input', () => {
		// when
		const wrapper = shallow(
			<Text
				id={'myForm'}
				isValid
				errorMessage={'My error message'}
				onChange={jest.fn()}
				onFinish={jest.fn()}
				schema={{ ...schema, type: 'password' }}
				value={'toto'}
			/>,
		);

		// then
		expect(wrapper.getElement()).toMatchSnapshot();
	});

	it('should render disabled input', () => {
		// given
		const disabledSchema = {
			...schema,
			disabled: true,
		};

		// when
		const wrapper = shallow(
			<Text
				id={'myForm'}
				isValid
				errorMessage={'My error message'}
				onChange={jest.fn()}
				onFinish={jest.fn()}
				schema={disabledSchema}
				value={'toto'}
			/>,
		);

		// then
		expect(wrapper.getElement()).toMatchSnapshot();
	});

	it('should render readonly input', () => {
		// given
		const readOnlySchema = {
			...schema,
			readOnly: true,
		};

		// when
		const wrapper = shallow(
			<Text
				id={'myForm'}
				isValid
				errorMessage={'My error message'}
				onChange={jest.fn()}
				onFinish={jest.fn()}
				schema={readOnlySchema}
				value={'toto'}
			/>,
		);

		// then
		expect(wrapper.getElement()).toMatchSnapshot();
	});

	it('should trigger onChange', () => {
		// given
		const onChange = jest.fn();
		const wrapper = shallow(
			<Text
				id={'myForm'}
				isValid
				errorMessage={'My error message'}
				onChange={onChange}
				onFinish={jest.fn()}
				schema={schema}
				value={'toto'}
			/>,
		);
		const event = { target: { value: 'totoa' } };

		// when
		wrapper.find('input').simulate('change', event);

		// then
		expect(onChange).toBeCalledWith(event, { schema, value: 'totoa' });
	});

	it('should trigger onChange with number value', () => {
		// given
		const numberSchema = {
			...schema,
			type: 'number',
		};
		const onChange = jest.fn();
		const wrapper = shallow(
			<Text
				id={'myForm'}
				isValid
				errorMessage={'My error message'}
				onChange={onChange}
				onFinish={jest.fn()}
				schema={numberSchema}
				value={2}
			/>,
		);
		const event = { target: { value: '25' } };

		// when
		wrapper.find('input').simulate('change', event);

		// then
		expect(onChange).toBeCalledWith(event, { schema: numberSchema, value: 25 });
	});

	it('should trigger onFinish on input blur', () => {
		// given
		const onFinish = jest.fn();
		const wrapper = shallow(
			<Text
				id={'myForm'}
				isValid
				errorMessage={'My error message'}
				onChange={jest.fn()}
				onFinish={onFinish}
				schema={schema}
				value={'toto'}
			/>,
		);
		const event = { target: { value: 'totoa' } };

		// when
		wrapper.find('input').simulate('blur', event);

		// then
		expect(onFinish).toBeCalledWith(event, { schema });
	});

	it('should render hidden input', () => {
		// given
		const hiddenSchema = {
			...schema,
			type: 'hidden',
		};

		// when
		const wrapper = shallow(
			<Text
				id={'myForm'}
				onChange={jest.fn()}
				onFinish={jest.fn()}
				schema={hiddenSchema}
				value={'toto'}
			/>,
		);

		// then
		expect(wrapper.getElement()).toMatchSnapshot();
	});
});
