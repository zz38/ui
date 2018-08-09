import PropTypes from 'prop-types';
import React from 'react';
import omit from 'lodash/omit';

class RowFocus extends React.Component {
	componentDidUpdate(prevProps) {
		if (!prevProps.focus && this.props.focus) {
			this.ref.focus();
		}
	}
	render() {
		const { WrappedComponent, selectCell, style, ...restProps } = this.props;
		return (
			<div
				tabIndex={0}
				ref={ref => {
					this.ref = ref;
				}}
				style={style}
				onClick={() => selectCell({ scrollToRow: this.props.index })}
			>
				<WrappedComponent {...restProps} />
			</div>
		);
	}
}

RowFocus.displayName = 'VirtualizedList(RowFocus)';
RowFocus.propTypes = {};

export default function getRowFocus(WrappedComponent, { focusOnRow, selectCell }) {
	return function RowFocusRenderer(props) {
		return (
			<RowFocus
				//{...omit(props, 'isScrolling')}
				focus={focusOnRow === props.index}
				selectCell={selectCell}
				WrappedComponent={WrappedComponent}
			/>
		);
	};
}
