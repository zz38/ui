import React from 'react';
import PropTypes from 'prop-types';
import { Map, List } from 'immutable';
import Component from '@talend/react-components';
import Toggle from './Toggle.connect';
export const DEFAULT_STATE = Map({
	highlighted: List(),
});

export default class AvroViewer extends React.Component {
	static displayName = 'Container(AvroViewer)';

	constructor(props) {
		super(props);
		this.onSelect = this.onSelect.bind(this);
	}

	onSelect(event, jsonpath) {
		const state = this.props.state || DEFAULT_STATE;
		const adaptedJsonPath = jsonpath
			.replace(/[-[{}()*+?.,\\^$|#\s]/g, '\\$&')
			.replace(/\[]/g, '[[0-9]+]');
		this.props.setState({
			highlighted: state.get('highlighted').set(0, new RegExp(`^${adaptedJsonPath}$`)),
		});
	}

	render() {
		const highlighted = this.props.state
			.get('highlighted', DEFAULT_STATE.get('highlighted'))
			.toJS();
		<Component />;
	}
	/*
	render() {
		const partStyle = {
			flexGrow: 1,
			flexShrink: 1,
			flexBasis: 50,
		};
		const highlighted = this.props.state.get('highlighted', DEFAULT_STATE.get('highlighted')).toJS();
		return (
			<div style={{ display: 'flex', alignItems: 'stretch', height: '1000px' }}>
				<div style={partStyle}>
					<Toggle
						componentId="Model"
						displayMode="model"
						onSelect={this.onSelect}
						data={this.props.sample.schema}
						menu={this.props.modelItemMenu}
						quality={{
							key: '@talend-quality@',
							menu: this.props.qualityMenu,
						}}
						isSingle
					/>
				</div>
				<div style={partStyle}>
					<Toggle
						componentId="Records"
						displayMode="records"
						avroRenderersIds={
							this.props.useCustomRenderers ? this.props.customAvroRenderersIds : ''
						}
						data={this.props.sample.data}
						getComponent={this.props.getComponent}
						highlighted={highlighted}
						schema={this.props.sample.schema}
					/>
				</div>
			</div>
		);
	}
	*/
}
