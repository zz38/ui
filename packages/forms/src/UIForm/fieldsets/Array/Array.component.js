import PropTypes from 'prop-types';
import React from 'react';
import Widget from '../../Widget';
import { shiftArrayErrorsKeys } from '../../utils/validation';
import defaultTemplates from '../../utils/templates';
import defaultWidgets from '../../utils/widgets';

function adaptKeyWithIndex(keys, index) {
	/*
	2 cases : 
	- key = ["my", "array", "", "nested"] for nested items fields
	- key = ["my", "array"] : this defines array itself. Each item will receive a key ["my", "array", index]
	To check that, we spot the first empty string in the key
	- find it: replace it, it's a nested element
	- not found : it's an array item key, we add the index after
	*/
	let firstIndexPlaceholder = keys.indexOf('');
	if (firstIndexPlaceholder === -1) {
		firstIndexPlaceholder = keys.length;
	}
	const indexedKeys = [...keys];
	indexedKeys[firstIndexPlaceholder] = index;
	return indexedKeys;
}

function getRange(previousIndex, nextIndex) {
	if (previousIndex < nextIndex) {
		return {
			minIndex: previousIndex,
			maxIndex: nextIndex + 1,
		};
	}

	return {
		minIndex: nextIndex,
		maxIndex: previousIndex + 1,
	};
}

function getNestedItemSchema(item, index) {
	const adaptedItem = {
		...item,
		key: item.key && adaptKeyWithIndex(item.key, index),
	};

	if (item.items) {
		adaptedItem.items = adaptedItem.items.map(nestedItem => getNestedItemSchema(nestedItem, index));
	}

	return adaptedItem;
}

function getArrayItemSchema(arraySchema, index) {
	// insert index in all fields
	const items = arraySchema.items.map(item => getNestedItemSchema(item, index));

	// insert index in item schema key
	const key = arraySchema.key && adaptKeyWithIndex(arraySchema.key, index);

	return {
		key,
		items,
		widget: arraySchema.itemWidget || 'fieldset',
	};
}

export default class ArrayWidget extends React.Component {
	constructor(props) {
		super(props);

		this.onAdd = this.onAdd.bind(this);
		this.onRemove = this.onRemove.bind(this);
		this.onReorder = this.onReorder.bind(this);
		this.renderItem = this.renderItem.bind(this);
	}

	onAdd(event) {
		const arrayMergedSchema = this.props.schema;
		const defaultValue = arrayMergedSchema.schema.items.type === 'object' ? {} : '';

		let currentValue = this.props.value;
		const widgetId = this.props.schema.itemWidget;
		const itemWidget = this.props.widgets[widgetId] || defaultWidgets[widgetId];
		if (itemWidget && itemWidget.isCloseable) {
			currentValue = currentValue.map(item => ({ ...item, isClosed: true }));
		}
		const value = currentValue.concat(defaultValue);

		const payload = { schema: arrayMergedSchema, value };
		this.props.onChange(event, payload);
		this.props.onFinish(event, payload);
	}

	onRemove(event, indexToRemove) {
		const schema = this.props.schema;
		const value = this.props.value.slice(0);
		value.splice(indexToRemove, 1);

		// shift up the items errors after the one we remove
		function widgetChangeErrors(errors) {
			return shiftArrayErrorsKeys(errors, {
				arrayKey: schema.key,
				minIndex: indexToRemove,
				shouldRemoveIndex: index => index === indexToRemove,
				getNextIndex: index => index - 1,
			});
		}

		const payload = { schema, value };
		this.props.onChange(event, payload);
		this.props.onFinish(event, payload, { widgetChangeErrors });
	}

	onReorder(event, { previousIndex, nextIndex }) {
		const schema = this.props.schema;
		const value = this.props.value.slice(0);
		const [item] = value.splice(previousIndex, 1);
		value.splice(nextIndex, 0, item);

		function widgetChangeErrors(errors) {
			// determine the range [min, max[ of items to shift, with the pace
			const { minIndex, maxIndex } = getRange(previousIndex, nextIndex);
			const switchPace = Math.sign(previousIndex - nextIndex);

			// shift the items errors between the previous and next position
			// set the item-we-move errors indexes
			return shiftArrayErrorsKeys(errors, {
				arrayKey: schema.key,
				minIndex,
				maxIndex,
				getNextIndex(index) {
					return index === previousIndex ? nextIndex : index + switchPace;
				},
			});
		}

		const payload = { schema, value };
		this.props.onChange(event, payload);
		this.props.onFinish(event, payload, { widgetChangeErrors });
	}

	getArrayTemplate() {
		const baseTemplateId = 'array';
		const templateId = `${baseTemplateId}_${this.props.displayMode}`;
		const ArrayTemplate = this.props.templates[templateId] || defaultTemplates[templateId];
		if (!ArrayTemplate) {
			return this.props.templates[baseTemplateId] || defaultTemplates[baseTemplateId];
		}
		return ArrayTemplate;
	}

	renderItem(index) {
		return (
			<Widget
				{...this.props}
				id={this.props.id && `${this.props.id}-${index}`}
				schema={getArrayItemSchema(this.props.schema, index)}
				value={this.props.value[index]}
			/>
		);
	}

	render() {
		const { schema } = this.props;
		const canReorder = schema.reorder !== false;
		const ArrayTemplate = this.getArrayTemplate();

		return (
			<ArrayTemplate
				{...this.props}
				canReorder={canReorder}
				onAdd={this.onAdd}
				onReorder={this.onReorder}
				onRemove={this.onRemove}
				renderItem={this.renderItem}
			/>
		);
	}
}

ArrayWidget.defaultProps = {
	items: [],
	value: [],
	templates: {},
	widgets: {},
};

if (process.env.NODE_ENV !== 'production') {
	ArrayWidget.propTypes = {
		displayMode: PropTypes.string,
		id: PropTypes.string,
		onChange: PropTypes.func.isRequired,
		onFinish: PropTypes.func.isRequired,
		schema: PropTypes.object.isRequired,
		templates: PropTypes.object.isRequired,
		value: PropTypes.arrayOf(PropTypes.object).isRequired,
		widgets: PropTypes.object.isRequired,
	};
}
