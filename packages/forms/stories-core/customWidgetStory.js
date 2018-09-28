import React from 'react';
import PropTypes from 'prop-types';
import { action } from '@storybook/addon-actions';
import { UIForm } from '../src/UIForm';
import ModalCodeField from '../src/UIForm/fields/Code/ModalCodeField.component';

function CustomWidget(props) {
	const { value } = props;

	return (
		<div className="panel panel-info">
			<div className="panel-heading">
				<h3 className="panel-title">Custom widget</h3>
			</div>
			<div className="panel-body">
				Form was instantiated with a custom widget to display its selected value
				<code>{value}</code>.
			</div>
		</div>
	);
}

CustomWidget.propTypes = {
	value: PropTypes.string,
};

function InjectModalRoot() {
	return <div id="modal-root" />;
}

function story() {
	const widgets = { custom: CustomWidget, code: ModalCodeField };
	const schema = {
		jsonSchema: {
			title: 'Unknown widget',
			type: 'object',
			properties: {
				codeWidgetModal: {
					type: 'string',
				},
				list: {
					type: 'string',
					enum: ['one', 'two', 'three'],
					enumNames: ['One', 'Two', 'Three'],
				},
			},
		},
		properties: {
			codeWidgetModal: '#hello comment',
			list: 'two',
		},
		uiSchema: [
			{
				key: 'codeWidgetModal',
				widget: 'code',
				description: "This widget with custom prop 'height: 100px'",
				title: 'Code small',
				options: {
					language: 'python',
					height: '100px',
				},
			},
			{
				key: 'list',
				type: 'custom',
			},
		],
	};
	return (
		<div>
			<InjectModalRoot />
			<UIForm
				widgets={widgets}
				data={schema}
				onChange={action('Change')}
				onSubmit={action('onSubmit')}
			/>
		</div>
	);
}

export default {
	name: 'Core Custom widget',
	story,
};
