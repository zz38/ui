import React from 'react';
import { action } from '@storybook/addon-actions';
import { object } from '@storybook/addon-knobs';
import { Tabs, Tab } from 'react-bootstrap';
import IconsProvider from 'react-talend-components/lib/IconsProvider';
import { UIForm, ConnectedUIForm } from '../src/UIForm';

const conceptsFilenames = require.context('./json/concepts', true, /.(js|json)$/);
const fieldsetsFilenames = require.context('./json/fieldsets', true, /.(js|json)$/);
const fieldsFilenames = require.context('./json/fields', true, /.(js|json)$/);
const sampleFilenameRegex = /^.\/(.*).js/;
const stories = [];

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function createCommonProps() {
	return {
		autocomplete: 'off',
		// onBlur: action('Blur'),
		customValidation(schema, value, properties) {
			action('customValidation')(schema, value, properties);
			return value.length >= 5 &&
				'Custom validation : The value should be less than 5 chars';
		},
		formName: 'my-form',
		onChange: action('Change'),
		onTrigger(event, payload) {
			action('Trigger')(event, payload);
			const schema = payload.schema;
			const key = schema.key && schema.key[schema.key.length - 1];
			return key && key.includes('fail') ?
				Promise.reject({ errors: { [schema.key]: 'This trigger has failed' } }) :
				Promise.resolve({});
		},
		onReset: action('onReset'),
		onSubmit: action('Submit'),
	};
}

function createStory(category, sampleFilenames, filename) {
	const sampleNameMatches = filename.match(sampleFilenameRegex);
	const sampleName = sampleNameMatches[sampleNameMatches.length - 1];
	const name = capitalizeFirstLetter(sampleName);
	const props = createCommonProps();

	return {
		category,
		name,
		story() {
			return (
				<section>
					<IconsProvider />

					<Tabs id={'store-tabs'}>
						<Tab
							eventKey={0}
							key={'without'}
							title={'State'}
						>
							<UIForm
								{...props}
								data={object(name, sampleFilenames(filename))}
							/>
						</Tab>
						<Tab
							eventKey={1}
							key={'with'}
							title={'Redux'}
						>
							<ConnectedUIForm
								{...props}
								data={object(name, sampleFilenames(filename))}
							/>
						</Tab>
					</Tabs>
				</section>
			);
		},
	};
}

conceptsFilenames
	.keys()
	.forEach((filename) => { stories.push(createStory('concepts', conceptsFilenames, filename)); });

fieldsetsFilenames
	.keys()
	.forEach((filename) => { stories.push(createStory('fieldsets', fieldsetsFilenames, filename)); });

fieldsFilenames
	.keys()
	.forEach((filename) => { stories.push(createStory('fields', fieldsFilenames, filename)); });

export default stories;
