import React from 'react';
import TCompForm from '../src/TCompForm';


const customTriggers = form => ({
	reloadForm: ({ body }) => {
		const { _datasetMetadata } = form.getUISpec().properties;
		return {
			...body,
			// reset the dynamic part
			properties: { _datasetMetadata },
		};
	},
});

class URLWrapper extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			definitionURL: 'http://localhost:3000/api/v1/forms/add',
			triggerURL: 'http://localhost:3000/api/v1/action/execute',
		};
		this.onDefinitionChange = this.onDefinitionChange.bind(this);
	}
	onDefinitionChange(event) {
		this.setState({ definitionURL: event.target.value });
	}
	render() {
		return (
			<div className="container">
				<div className="col-md-6">
					<input onChange={this.onDefinitionChange} value={this.state.definitionURL} />
					<TCompForm
						componentId="demo"
						uiSpecPath="ui"
						customTriggers={customTriggers}
						{...this.state}
					/>
				</div>
			</div>
		);
	}
}

const ExampleTCompForm = {
	default: () => <URLWrapper />,
};

export default ExampleTCompForm;
