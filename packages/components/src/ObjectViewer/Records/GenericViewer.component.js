import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import theme from './GenericViewer.scss';
import getJSONPath from '../jsonPath';
import Icon from '../../Icon';

const paddingLeft = 25;
const marginLeft = 4;

function defaultFormatValue(value) {
	if (typeof value === 'string') {
		return `"${value}"`;
	}
	return value;
}

function defaultGetDataType(data) {
	if (Array.isArray(data)) {
		return 'array';
	}
	return typeof data;
}

function defaultGetFields(data, type) {
	if (type === 'object') {
		return Object.keys(data).map(dataKey => ({ dataKey, value: data[dataKey] }));
	}
	return data;
}

function defaultGetQuality() {
	return null;
}

function defaultGetValue(value) {
	return value;
}

function defaultGetIcon({ isOpened }) {
	const name = isOpened ? 'talend-caret-down' : 'talend-chevron-left';
	const transform = isOpened ? null : 'rotate-180';

	return { name, transform };
}

function DefaultValueItem(props) {
	const { className, dataKey, formatValue, getQuality, getValue, style, value } = props;
	const quality = getQuality(props);
	return (
		<span className={className} style={style}>
			{quality === 'invalid' && <div className={classNames(theme['invalid-value'], 'tc-object-viewer-invalid-value')} />}
			<span className={theme.key}>{dataKey}</span>:
			<span className={theme.value}>{formatValue(getValue(value))}</span>
		</span>
	);
}
DefaultValueItem.defaultProps = {
	formatValue: defaultFormatValue,
	getQuality: defaultGetQuality,
	getValue: defaultGetValue,
	value: '',
};
DefaultValueItem.propTypes = {
	className: PropTypes.string,
	dataKey: PropTypes.string,
	formatValue: PropTypes.func,
	getQuality: PropTypes.func,
	getValue: PropTypes.func,
	style: PropTypes.object,
	value: PropTypes.any,
};

function DefaultItem(props) {
	const {
		className,
		data,
		fields,
		getIcon,
		getQuality,
		isOpened,
		jsonpath,
		dataKey,
		onClick,
		onToggle,
		style,
		type,
	} = props;

	const content = [<span key={'datakey'}>{dataKey}</span>];
	if (type === 'array') {
		content.push(
			<span key={'length'}>
				<sup className={classNames(theme.badge, 'badge', 'tc-object-viewer-badge')}>
					{fields.length}
				</sup>
			</span>
		);
	}
	if (!isOpened && getQuality(props) === 'invalid') {
		content.push(
			<div key={'quality'} className={classNames(theme['invalid-dot'], 'tc-object-viewer-invalid-dot')} />
		);
	}

	let main;
	if (onClick) {
		main = (
			<button
				key={'main'}
				aria-label={`Select ${dataKey} (${jsonpath})`}
				onClick={onClick}
				className={theme.main}
			>
				{content}
			</button>
		);
	} else {
		main = (<span key={'main'} className={theme.main}>{content}</span>);
	}

	const icon = getIcon(props);
	function onIconClick(event) {
		onToggle(event, { data, isOpened, jsonpath });
	}

	return (
		<div className={className} style={style}>
			<Icon
				key={'icon'}
				title={isOpened ? `Collapse ${dataKey} (${jsonpath})` : `Expand ${dataKey} (${jsonpath})`}
				name={icon.name}
				transform={icon.transform}
				className={classNames(theme.caret, icon.className)}
				onClick={onIconClick}
			/>
			{main}
		</div>
	);
}
DefaultItem.defaultProps = {
	getIcon: defaultGetIcon,
	getQuality: defaultGetQuality,
	fields: [],
};
DefaultItem.propTypes = {
	className: PropTypes.string,
	data: PropTypes.any,
	fields: PropTypes.array,
	getIcon: PropTypes.func,
	getQuality: PropTypes.func,
	isOpened: PropTypes.bool,
	jsonpath: PropTypes.string,
	dataKey: PropTypes.oneOfType(PropTypes.string, PropTypes.number),
	onClick: PropTypes.func,
	onToggle: PropTypes.func,
	style: PropTypes.object,
	type: PropTypes.string,
};

function DefaultFields({ fields, jsonpath, level, type, ...props }) {
	return (
		<ul>
			{fields.map((field, index) => {
				const itemProps = {
					...props,
					key: index,
					level: level + 1,
				};
				if (type === 'array') {
					itemProps.dataKey = index;
					itemProps.value = field;
				} else if (type === 'object') {
					itemProps.dataKey = field.dataKey;
					itemProps.value = field.value;
				}
				itemProps.jsonpath = getJSONPath(itemProps.dataKey, jsonpath, type);

				return (
					<Item {...itemProps} />
				);
			})}
		</ul>
	);
}
DefaultFields.defaultProps = {
	fields: [],
};
DefaultFields.propTypes = {
	fields: PropTypes.array,
	jsonpath: PropTypes.string,
	level: PropTypes.number,
	type: PropTypes.string,
};

function Item(props) {
	const {
		getDataType,
		getFields,
		highlighted,
		jsonpath,
		level,
		nodeRenderers,
		onSelect,
		opened,
		value,
	} = props;
	debugger;
	const isHighlighted = highlighted.find(pattern => jsonpath.match(pattern));
	const isOpened = opened.indexOf(jsonpath) !== -1;
	const itemType = getDataType(value);

	const caretSpaceAdjustment = marginLeft * level;
	const levelSpaceAdjustment = paddingLeft * level;
	const spaceAdjustment = { paddingLeft: caretSpaceAdjustment + levelSpaceAdjustment };
	const onClick = onSelect && (event => onSelect(event, jsonpath, value));

	let ItemComponent;
	let FieldsComponent;
	let fields;
	switch (itemType) {
		case 'array':
			ItemComponent = nodeRenderers.array || DefaultItem;
			FieldsComponent = nodeRenderers.arrayFields || DefaultFields;
			fields = getFields(value, itemType);
			break;
		case 'object':
			ItemComponent = nodeRenderers.object || DefaultItem;
			FieldsComponent = nodeRenderers.objectFields || DefaultFields;
			fields = getFields(value, itemType);
			break;
		default:
			ItemComponent = nodeRenderers.value || DefaultValueItem;
	}

	const itemContentClassName = classNames(
		theme.content,
		{ [theme.highlight]: isHighlighted }
	);

	return (
		<li className={classNames(theme.item, 'tc-object-viewer-item')}>
			<ItemComponent
				{...props}
				className={itemContentClassName}
				fields={fields}
				onClick={onClick}
				isHighlighted={isHighlighted}
				isOpened={isOpened}
				style={spaceAdjustment}
				type={itemType}
			/>
			{isOpened &&
				<FieldsComponent {...props} type={itemType} fields={fields} />
			}
		</li>
	);
}
Item.defaultProps = {
	getDataType: defaultGetDataType,
	getFields: defaultGetFields,
	highlighted: [],
	jsonpath: '',
	opened: [],
	nodeRenderers: {},
	value: '',
};
Item.propTypes = {
	getDataType: PropTypes.func,
	getFields: PropTypes.func,
	highlighted: PropTypes.arrayOf(PropTypes.string),
	jsonpath: PropTypes.string,
	level: PropTypes.number,
	nodeRenderers: PropTypes.shape({
		array: PropTypes.func,
		object: PropTypes.func,
		value: PropTypes.func,
	}),
	onSelect: PropTypes.func,
	opened: PropTypes.arrayOf(PropTypes.string),
	value: PropTypes.any,
};

export default function GenericViewer({ className, style, title, ...props }) {
	return (
		<ul className={classNames(theme['tc-viewer'], 'tc-viewer', className)} style={style}>
			<Item {...props} dataKey={title} jsonpath={'$'} value={props.data} level={0} />
		</ul>
	);
}
GenericViewer.propTypes = {
	className: PropTypes.string,
	data: PropTypes.oneOfType(PropTypes.array, PropTypes.object),
	title: PropTypes.string,
	style: PropTypes.object,
};
