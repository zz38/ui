import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import {
	Table as VirtualizedTable,
	defaultTableRowRenderer as DefaultTableRowRenderer,
} from 'react-virtualized';
import memoizeOne from 'memoize-one';
import isEqual from 'lodash/isEqual';

import getRowSelectionRenderer from '../RowSelection';
import getRowFocus from '../RowFocus';

import { DROPDOWN_CONTAINER_CN } from '../../Actions/ActionDropdown';
import { decorateRowClick, decorateRowDoubleClick } from '../event/rowclick';

import theme from './ListTable.scss';
import rowThemes from './RowThemes';

const getMemoizedRowFocus = memoizeOne(getRowFocus, isEqual);
const getMemoizedRowSelectionRenderer = memoizeOne(getRowSelectionRenderer, isEqual);
const getRowData = rowProps => rowProps.rowData;

/**
 * List renderer that renders a react-virtualized Table
 */
function ListTable(props) {
	const {
		collection,
		id,
		isActive,
		isSelected,
		onRowClick,
		onRowDoubleClick,
		selectCell,
		...restProps
	} = props;

	let RowTableRenderer = getMemoizedRowFocus(DefaultTableRowRenderer, {
		focusOnRow: restProps.scrollToIndex,
		selectCell,
	});
	if (isActive || isSelected) {
		RowTableRenderer = getMemoizedRowSelectionRenderer(RowTableRenderer, {
			isSelected,
			isActive,
			getRowData,
		});
	}

	const onRowClickCallback = decorateRowClick(onRowClick);
	const onRowDoubleClickCallback = decorateRowDoubleClick(onRowDoubleClick);

	return (
		<VirtualizedTable
			className={`tc-list-table ${theme['tc-list-table']}`}
			gridClassName={`${theme.grid} ${DROPDOWN_CONTAINER_CN}`}
			headerHeight={35}
			id={id}
			onRowClick={onRowClickCallback}
			onRowDoubleClick={onRowDoubleClickCallback}
			rowClassName={({ index }) =>
				classNames(...['tc-list-item', rowThemes, collection[index] && collection[index].className])
			}
			rowCount={collection.length}
			rowGetter={({ index }) => collection[index]}
			rowRenderer={RowTableRenderer}
			{...restProps}
		/>
	);
}
ListTable.displayName = 'VirtualizedList(ListTable)';
ListTable.propTypes = {
	children: PropTypes.arrayOf(PropTypes.element),
	collection: PropTypes.arrayOf(PropTypes.object),
	disableHeader: PropTypes.bool,
	height: PropTypes.number,
	id: PropTypes.string,
	isActive: PropTypes.func,
	isSelected: PropTypes.func,
	noRowsRenderer: PropTypes.func,
	onRowClick: PropTypes.func,
	onRowDoubleClick: PropTypes.func,
	rowHeight: PropTypes.number,
	sort: PropTypes.func,
	sortBy: PropTypes.string,
	sortDirection: PropTypes.string,
	width: PropTypes.number,
};

ListTable.defaultProps = {
	disableHeader: false,
	rowHeight: 50,
};

export default ListTable;
