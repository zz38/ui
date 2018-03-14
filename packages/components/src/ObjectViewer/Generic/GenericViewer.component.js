import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
	defaultFormatValue,
	defaultGetDataType,
	defaultGetDisplayKey,
	defaultGetFields,
	defaultGetIcon,
	defaultGetJSONPath,
	defaultGetQuality,
	defaultGetValue,
} from './genericViewer.configuration';
import Icon from '../../Icon';
import theme from './GenericViewer.scss';

const paddingLeft = 30;

function DefaultValueItem(props) {
	const {
		className,
		dataKey,
		formatValue,
		getDisplayKey,
		getQuality,
		getItemMenu,
		getValue,
		jsonpath,
		onClick,
		style,
	} = props;
	const quality = getQuality(props);
	const formattedKey = getDisplayKey(props);
	const formattedValue = formatValue(getValue(props));
	const content = [
		quality === 'invalid' && <div key={'quality'} className={classNames(theme['invalid-value'], 'tc-object-viewer-invalid-value')} />,
		<div key={'key-value'} className={theme['key-value']}>
			<span key={'key'} className={theme.key}>{formattedKey}</span>
			{formattedValue && ': '}
			<span key={'value'} title={formattedValue} className={theme.value}>{formattedValue}</span>
		</div>,
	];
	if (onClick) {
		return (
			<div className={className} style={style}>
				<button
					key={'main'}
					aria-label={`Select ${dataKey} (${jsonpath})`}
					onClick={onClick}
					className={theme.main}
				>
					{content}
				</button>
				{getItemMenu && getItemMenu(props)}
			</div>
		);
	}
	return (
		<div className={className} style={style}>
			{content}
		</div>
	);
}
DefaultValueItem.defaultProps = {
	formatValue: defaultFormatValue,
	getDisplayKey: defaultGetDisplayKey,
	getQuality: defaultGetQuality,
	getValue: defaultGetValue,
};
DefaultValueItem.propTypes = {
	className: PropTypes.string,
	dataKey: PropTypes.string,
	formatValue: PropTypes.func,
	getDisplayKey: PropTypes.func,
	getItemMenu: PropTypes.func,
	getQuality: PropTypes.func,
	getValue: PropTypes.func,
	jsonpath: PropTypes.string,
	onClick: PropTypes.func,
	style: PropTypes.object,
};

function DefaultItem(props) {
	const {
		className,
		data,
		fields,
		getIcon,
		getDisplayKey,
		getQuality,
		isOpened,
		jsonpath,
		dataKey,
		onClick,
		onToggle,
		style,
		type,
	} = props;

	const content = [<span key={'datakey'}>{getDisplayKey(props)}</span>];
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
	getDisplayKey: defaultGetDisplayKey,
	getQuality: defaultGetQuality,
	fields: [],
};
DefaultItem.propTypes = {
	className: PropTypes.string,
	data: PropTypes.any,
	fields: PropTypes.array,
	getDisplayKey: PropTypes.func,
	getIcon: PropTypes.func,
	getQuality: PropTypes.func,
	isOpened: PropTypes.bool,
	jsonpath: PropTypes.string,
	dataKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	onClick: PropTypes.func,
	onToggle: PropTypes.func,
	style: PropTypes.object,
	type: PropTypes.string,
};

function DefaultFields({ dataKey, fields, jsonpath, level, type, value, ...props }) {
	return (
		<ul className={'tc-object-viewer-nested'}>
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
				itemProps.jsonpath = props.getJSONPath({
					dataKey: itemProps.dataKey,
					parent: {
						dataKey,
						jsonpath,
						type,
						value,
					},
				});

				return (
					<Item {...itemProps} />
				);
			})}
		</ul>
	);
}
DefaultFields.defaultProps = {
	fields: [],
	getJSONPath: defaultGetJSONPath,
};
DefaultFields.propTypes = {
	dataKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	fields: PropTypes.array,
	getJSONPath: PropTypes.func,
	jsonpath: PropTypes.string,
	level: PropTypes.number,
	type: PropTypes.string,
	value: PropTypes.any,
};

function Item(props) {
	const {
		getDataType,
		getFields,
		highlighted,
		jsonpath,
		level,
		nodeRenderers,
		noRoot,
		onSelect,
		opened,
		value,
	} = props;
	const forceRootOpen = noRoot && level === 0;
	const isHighlighted = highlighted.find(pattern => jsonpath.match(pattern));
	const isOpened = forceRootOpen || (opened.indexOf(jsonpath) !== -1);
	const itemType = getDataType(value);

	const spaceAdjustment = { paddingLeft: paddingLeft * level };
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
		'tc-object-viewer-content'
,		{ [theme['no-root']]: forceRootOpen },
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
	nodeRenderers: {},
	opened: [],
	value: '',
};
Item.propTypes = {
	getDataType: PropTypes.func,
	getFields: PropTypes.func,
	highlighted: PropTypes.array,
	jsonpath: PropTypes.string,
	level: PropTypes.number,
	nodeRenderers: PropTypes.shape({
		array: PropTypes.func,
		object: PropTypes.func,
		value: PropTypes.func,
	}),
	noRoot: PropTypes.bool,
	onSelect: PropTypes.func,
	opened: PropTypes.arrayOf(PropTypes.string),
	value: PropTypes.any,
};

export default function GenericViewer({ className, style, title, ...props }) {
	const cn = classNames(
		theme['tc-viewer'],
		'tc-object-viewer',
		className,
	);
	return (
		<ul className={cn} style={style}>
			<Item
				{...props}
				dataKey={title}
				jsonpath={'$'}
				value={props.data}
				level={0}
			/>
		</ul>
	);
}
GenericViewer.propTypes = {
	className: PropTypes.string,
	data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
	title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	style: PropTypes.object,
};
