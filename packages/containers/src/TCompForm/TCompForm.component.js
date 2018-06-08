import React from 'react';
import cmf, { cmfConnect } from '@talend/react-cmf';
import { UIForm } from '@talend/react-forms/lib/UIForm';
import omit from 'lodash/omit';
import { Map } from 'immutable';
import { CircularProgress } from '@talend/react-components';
import kit from 'component-kit.js';

export const DEFAULT_STATE = new Map({
	dirty: false,
});


class TCompForm extends React.Component {
	static displayName = 'TCompForm';
	static propTypes = {
		...cmfConnect.propTypes,
	};
	static defaultProps = {
		customTriggers: () => {},
	};
	static getCollectionId = componentId => `tcomp-form${componentId}`;

	constructor(props) {
		super(props);
		this.state = {};
		this.onTrigger = this.onTrigger.bind(this);
		this.getUISpec = this.getUISpec.bind(this);
		// this.trigger = kit.createTriggers({
		// 	url: this.props.triggerURL,
		// 	customRegistry: this.props.customTriggers(this),
		// });
	}

	onChange(event, data) {
		this.setState({ properties: data.properties });
		this.props.dispatch({
			type: 'TCOMP_FORM_ON_CHANGE',
			event: {
				type: 'onChange',
				component: 'TCompForm',
				props: this.props,
				state: this.state,
				source: event,
			},
			data,
			uiSpec: this.uiSpec(),
		});
	}

	onTrigger(event, payload) {
		this.trigger(event, payload).then(data => {
			if (data.properties) {
				this.setState({ properties: data.properties });
			}
			this.props.dispatch({
				type: 'TCOMP_FORM_ON_TRIGGER',
				event: {
					type: 'onTrigger',
					component: 'TCompForm',
					props: this.props,
					state: this.state,
				},
				data,
				uiSpec: this.uiSpec(),
			});
		});
	}

	getUISpec() {
		return {
			jsonSchema: this.props.state.get('jsonSchema', new Map()).toJS(),
			uiSchema: this.props.state.get('uiSchema', new Map()).toJS(),
			properties: this.state.properties,
		};
	}

	render() {
		const props = Object.assign(
			{},
			omit(this.props, cmfConnect.INJECTED_PROPS),
			this.getUISpec(),
			{
				onTrigger: this.onTrigger,
			},
		);
		if (!props.jsonSchema) {
			return <CircularProgress />;
		}
		if (this.state.properties) {
			props.properties = this.state.properties;
		}
		return <UIForm {...props} />;
	}
}

export function mapStateToProps(state, ownProps) {
	const props = {};
	// if (ownProps.definitionURL) {
	// 	let collectionPath = TCompForm.getCollectionId(ownProps.componentId);
	// 	if (ownProps.uiSpecPath) {
	// 		collectionPath = `${collectionPath}.${ownProps.uiSpecPath}`;
	// 	}
	// 	const schema = cmf.selectors.collections.toJS(state, collectionPath);
	// 	if (schema) {
	// 		Object.assign(props, schema);
	// 	}
	// }
	return props;
}

export default cmfConnect({
	defaultState: DEFAULT_STATE,
	defaultProps: {
		saga: 'TCompForm#default',
	},
	mapStateToProps,
})(TCompForm);
