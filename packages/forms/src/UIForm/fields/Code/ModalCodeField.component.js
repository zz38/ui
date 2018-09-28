import React from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import Code from './Code.component';
import ModalableFormWidget from '../modal/ModalableFormWidget.component';

export default function ModalCodeField(props) {
	const detailedProps = merge({}, props, { schema: { options: { showGutter: true } } });
	return (
		<ModalableFormWidget
			modalTitle={props.schema.title}
			detailedChildren={<Code {...detailedProps} />}
		>
			<Code {...props} />
		</ModalableFormWidget>
	);
}
ModalCodeField.propTypes = {
	id: PropTypes.string,
	schema: PropTypes.object,
};
ModalCodeField.defaultProps = {
	schema: {},
};
