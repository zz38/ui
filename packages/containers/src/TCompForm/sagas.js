
import { call, put, select, take, takeEvery } from 'redux-saga/effects';
import cmf from '@talend/react-cmf';
import Component from './TCompForm.component';

function* fecthDefinition(url, componentId) {
	const { data, response } = yield call(cmf.sagas.http.get, url);
	if (!response.ok) {
		return;
	}
	yield put(Component.setStateAction(data, componentId));
}

function* onDidMount({ componentId, definitionURL }) {
	const hasCollection = yield select(state => state.cmf.collections.has(collectionId));
	if (!hasCollection) {
		yield fecthDefinition(definitionURL, 'demo');
	}
}

function* onTrigger(action) {
	if (action.jsonSchema || action.uiSchema) {

	}
}

function* handle(props) {
	yield call(onDidMount, props);
	yield takeEvery('TCOMP_FORM_ON_TRIGGER', onTrigger);
	yield take('DO_NOT_QUIT');
}

export default {
	'TCompForm#default': handle,
};
