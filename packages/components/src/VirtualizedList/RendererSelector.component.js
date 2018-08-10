import PropTypes from 'prop-types';
import React from 'react';
import { ArrowKeyStepper } from 'react-virtualized';

import { listTypes } from './utils/constants';
import { rowDictionary } from './utils/dictionary';
import NoRows from './NoRows';
import ListTable from './ListTable';
import ListGrid from './ListGrid';
import propTypes from './PropTypes';
import Loader from '../Loader';

const { TABLE } = listTypes;

/**
 * Select the ListGrid row renderer to use
 * @param type The row renderer type
 */
function getRowRenderer(type) {
	const rowRenderer = rowDictionary[type];
	if (!rowRenderer) {
		const rowRendererTypes = [TABLE].concat(Object.keys(rowDictionary));
		throw new Error(
			`Unknown row renderer in Virtualized List : ${type}. ` +
				`Possible values are [${rowRendererTypes}].`,
		);
	}
	return rowRenderer;
}

/**
 * Component that maps list types to the corresponding component
 */
class RendererSelector extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.selectCell = this.selectCell.bind(this);
		this.noRowsRenderer = this.noRowsRenderer.bind(this);
	}

	selectCell(nextState) {
		this.setState(nextState);
	}

	noRowsRenderer() {
		if (this.props.inProgress) {
			return <Loader className={'tc-virtualizedlist-no-result'} />;
		}
		const NoRowsRenderer = this.props.noRowsRenderer;
		return <NoRowsRenderer />;
	}

	render() {
		const {
			children,
			height,
			id,
			isSelected,
			isActive,
			onRowClick,
			onRowDoubleClick,
			rowHeight,
			sort,
			sortBy,
			sortDirection,
			type,
			width,
			disableHeader,
			inProgress,
		} = this.props;

		const collection = inProgress ? [] : this.props.collection;

		const commonProps = {
			children,
			collection,
			height,
			id,
			isActive,
			isSelected,
			noRowsRenderer: this.noRowsRenderer,
			onRowClick,
			onRowDoubleClick,
			rowHeight,
			width,
		};

		let ListRenderer;
		let customProps;

		if (type === TABLE) {
			ListRenderer = ListTable;
			customProps = {
				disableHeader,
				sort,
				sortBy,
				sortDirection,
			};
		} else {
			ListRenderer = ListGrid;
			customProps = { rowRenderer: getRowRenderer(type) };
		}

		return (
			<div>
				Selected {this.state.scrollToRow}
				<ArrowKeyStepper
					columnCount={1}
					rowCount={collection.length}
					mode="cells"
					onScrollToChange={this.selectCell}
					scrollToRow={this.state.scrollToRow}
				>
					{({ onSectionRendered, scrollToRow }) => (
						<ListRenderer
							{...commonProps}
							{...customProps}
							onRowsRendered={onSectionRendered}
							scrollToIndex={scrollToRow}
							selectCell={this.selectCell}
						/>
					)}
				</ArrowKeyStepper>
			</div>
		);
	}
}
RendererSelector.displayName = 'VirtualizedList(RendererSelector)';
RendererSelector.propTypes = {
	...propTypes,
	height: PropTypes.number,
	width: PropTypes.number,
};
RendererSelector.defaultProps = {
	noRowsRenderer: NoRows,
	type: TABLE,
};

export default RendererSelector;
