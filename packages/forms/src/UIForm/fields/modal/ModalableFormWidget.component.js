/**
 * Meant to be reused
 */
import React from 'react';
import PropTypes from 'prop-types';

import ModalFormWidget from './ModalFormWidget.component';

/**
 * This component wrap a children, providing a button to trigger the modal
 * ability, projecting the wrapped childrne into the modal, or
 * a different one, allowing for various view/details UX
 */
export default class ModalableFormWidget extends React.Component {
	constructor(props) {
		super(props);
		this.toogleOn = this.toogleOn.bind(this);
		this.toggleOff = this.toggleOff.bind(this);
		this.state = { toggled: false };
	}

	toogleOn() {
		this.setState({ toggled: true });
	}

	toggleOff() {
		this.setState({ toggled: false });
	}

	render() {
		const { children, detailedChildren } = this.props;
		return (
			<div>
				{children}
				<button onClick={this.toogleOn}>modal</button>
				{this.state.toggled && (
					<ModalFormWidget {...this.props} toggleOff={this.toggleOff}>
						{detailedChildren || children }
					</ModalFormWidget>
				)}
			</div>
		);
	}
}

ModalableFormWidget.propTypes = {
	children: PropTypes.element.isRequired,
	detailedChildren: PropTypes.element,
	modalTitle: PropTypes.string,
	closeButtonTitle: PropTypes.string,
};
