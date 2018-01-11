import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { DropdownButton, MenuItem, OverlayTrigger } from 'react-bootstrap';
import Inject from '../../Inject';
import theme from './ActionDropdown.scss';
import TooltipTrigger from '../../TooltipTrigger';
import Icon from '../../Icon';
import { wrapOnClick } from '../Action/Action.component';

function InjectDropdownMenuItem({
	getComponent,
	component,
	divider,
	withMenuItem,
	liProps,
	menuItemProps,
	key,
	...rest
}) {
	if (divider) {
		return <MenuItem key={key} {...menuItemProps} divider />;
	}
	if (withMenuItem) {
		return (
			<MenuItem key={key} {...menuItemProps}>
				<Inject component={component} getComponent={getComponent} {...rest} />
			</MenuItem>
		);
	}
	return (
		<li role="presentation" key={key} {...liProps}>
			<Inject component={component} getComponent={getComponent} {...rest} />
		</li>
	);
}

InjectDropdownMenuItem.propTypes = {
	getComponent: PropTypes.func.isRequired,
	component: PropTypes.string,
	divider: PropTypes.bool,
	withMenuItem: PropTypes.bool,
	liProps: PropTypes.object,
	menuItemProps: PropTypes.object,
	key: PropTypes.number,
};

function getMenuItem(item, index) {
	if (item.divider) {
		return <MenuItem key={index} divider />;
	}
	return (
		<MenuItem key={index} eventKey={item} {...item} onClick={wrapOnClick(item)}>
			{item.icon && <Icon name={item.icon} />}
			{item.label}
		</MenuItem>
	);
}

/**
 * @param {object} props react props
 * @example
 const props = {
	label: 'related items',
	icon: 'fa fa-file-excel-o',
	items: [
		{
			icon: 'talend-icon',
			label: 'document 1',
			onClick: action('document 1 click'),
		},
		{
			divider: true,
		},
		{
			label: 'document 2',
			onClick: action('document 2 click'),
		},
	],
	tooltipPlacement: 'right',
	hideLabel: true,
	link: true,
	onSelect: action('item selected'),
};
 <ActionDropdown {...props} />
 */
function ActionDropdown(props) {
	const {
		bsStyle,
		hideLabel,
		icon,
		items,
		label,
		link,
		onSelect,
		tooltipPlacement,
		tooltipLabel,
		getComponent,
		components,
		...rest
	} = props;

	const injected = Inject.all(getComponent, components, InjectDropdownMenuItem);
	const title = (
		<span className="tc-dropdown-button-title">
			{icon ? <Icon name={icon} /> : null}
			{hideLabel ? null : <span className="tc-dropdown-button-title-label">{label}</span>}
		</span>
	);
	const style = link ? 'link' : bsStyle;

	function onItemSelect(object, event) {
		if (onSelect) {
			onSelect(event, object);
		}
	}

	const dropdown = (
		<DropdownButton
			title={title}
			bsStyle={style}
			role="button"
			onSelect={onItemSelect}
			className={classNames(theme['tc-dropdown-button'], 'tc-dropdown-button')}
			{...rest}
		>
			{!items.length && !components && <MenuItem disabled>No options</MenuItem>}
			{injected('beforeItemsDropdown')}
			{items.map(getMenuItem)}
			{injected('itemsDropdown')}
			{injected('afterItemsDropdown')}
		</DropdownButton>
	);

	if (hideLabel || tooltipLabel) {
		return (
			<TooltipTrigger label={tooltipLabel || label} tooltipPlacement={tooltipPlacement}>
				{dropdown}
			</TooltipTrigger>
		);
	}
	return dropdown;
}

ActionDropdown.displayName = 'ActionDropdown';

ActionDropdown.propTypes = {
	bsStyle: PropTypes.string,
	hideLabel: PropTypes.bool,
	icon: PropTypes.string,
	items: PropTypes.arrayOf(
		PropTypes.shape({
			icon: PropTypes.string,
			label: PropTypes.string,
			...MenuItem.propTypes,
		}),
	).isRequired,
	label: PropTypes.string.isRequired,
	link: PropTypes.bool,
	onSelect: PropTypes.func,
	tooltipPlacement: OverlayTrigger.propTypes.placement,
	tooltipLabel: PropTypes.string,
	getComponent: PropTypes.func,
	components: PropTypes.shape({
		beforeItemsDropdown: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
		itemsDropdown: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
		afterItemsDropdown: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
	}),
};

ActionDropdown.defaultProps = {
	bsStyle: 'default',
	tooltipPlacement: 'top',
	items: [],
};

export { ActionDropdown as default, getMenuItem, InjectDropdownMenuItem };
