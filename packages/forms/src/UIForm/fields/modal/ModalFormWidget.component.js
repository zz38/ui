import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Dialog from '@talend/react-components/lib/Dialog';

let modalRoot = null;

export default class ModalFormWidget extends React.Component {
	constructor(props) {
		super(props);
		this.el = document.createElement('div');
	}

	componentDidMount() {
		if (modalRoot === null) {
			modalRoot = document.querySelector('#modal-root');
		}
		modalRoot.appendChild(this.el);
	}
	componentWillUnmount() {
		modalRoot.removeChild(this.el);
	}
	render() {
		const { children, toggleOff, modalTitle, closeButtonTitle } = this.props;
		return ReactDOM.createPortal(
			<Dialog
				show
				header={modalTitle}
				onHide={toggleOff}
				action={{
					label: closeButtonTitle || 'Close',
					onClick: toggleOff,
				}}
			>
				{children}
			</Dialog>,
			this.el,
		);
	}
}

ModalFormWidget.propTypes = {
	children: PropTypes.element.isRequired,
	toggleOff: PropTypes.func.isRequired,
	modalTitle: PropTypes.string,
	closeButtonTitle: PropTypes.string,
};
