import { call, put, select, take, takeEvery } from 'redux-saga/effects';
import cmf from '@talend/react-cmf';
import get from 'lodash/get';
import Component from './ComponentForm.component';

function* fecthDefinition({ definitionURL, componentId, uiSpecPath }) {
	const { data, response } = yield call(cmf.sagas.http.get, definitionURL);
	if (!response.ok) {
		yield put(
			Component.setStateAction(prev => {
				return prev.set({
					jsonSchema: undefined,
					uiSchema: undefined,
					response,
					dirty: false,
				});
			}, componentId),
		);
	} else {
		if (uiSpecPath) {
			yield put(
				Component.setStateAction(
					{
						definition: data,
						...get(data, uiSpecPath),
					},
					componentId,
				),
			);
		} else {
			yield put(Component.setStateAction(data, componentId));
		}
	}
}

function* onDidMount({ componentId = 'default', definitionURL, uiSpecPath }) {
	const state = yield select();
	if (!Component.getState(state, componentId).get('jsonSchema')) {
		yield fecthDefinition({ definitionURL, componentId, uiSpecPath });
	}
}

function* handle(props) {
	yield call(onDidMount, props);
	yield takeEvery(Component.ON_DEFINITION_URL_CHANGED, fecthDefinition);
	// eslint-disable-next-line no-constant-condition
	while (true) {
		const action = yield take(Component.ON_CHANGE);
		if (action.event.props.syncChangeInStore) {
			yield put(
				Component.setStateAction({ properties: action.properties }, action.event.props.componentId),
			);
		}
	}
}

export default {
	'ComponentForm#default': handle,
};
