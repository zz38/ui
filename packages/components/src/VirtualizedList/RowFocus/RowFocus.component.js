import React from 'react';
import PropTypes from 'prop-types';

import theme from './RowFocus.scss';

class RowFocus extends React.PureComponent {
	componentDidUpdate(prevProps) {
		if (!prevProps.focus && this.props.focus) {
			this.ref.focus();
		}
	}
	render() {
		const { WrappedComponent, selectCell, style, ...restProps } = this.props;
		return (
			<div
				key={`row-focus-${this.props.index}`}
				tabIndex={0}
				ref={ref => {
					this.ref = ref;
				}}
				style={style}
				onClick={() => selectCell({ scrollToRow: this.props.index })}
				className={`row-focus-container ${theme['row-focus-container']}`}
			>
				<WrappedComponent {...restProps} />
			</div>
		);
	}
}

RowFocus.displayName = 'VirtualizedList(RowFocus)';
RowFocus.propTypes = {
	focus: PropTypes.bool, // indicates if the row should have the focus
	selectCell: PropTypes.func, // callback on row click
	style: PropTypes.object, // react-virtualized inline style
	WrappedComponent: PropTypes.func, // real row renderer component
};

export default function getRowFocus(WrappedComponent, { focusOnRow, selectCell }) {
	return function RowFocusRenderer(props) {
		return (
			<RowFocus
				{...props}
				focus={focusOnRow === props.index}
				selectCell={selectCell}
				WrappedComponent={WrappedComponent}
			/>
		);
	};
}
