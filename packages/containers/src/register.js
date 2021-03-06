import cmf, { cmfConnect } from '@talend/react-cmf';
import omit from 'lodash/omit';
import * as components from '@talend/react-components';
import * as containers from './index';

export function registerAllContainers() {
	const onlyReactComponent = omit(containers, ['actionAPI']);
	cmf.component.registerMany(onlyReactComponent);

	const alreadyRegistered = Object.keys(onlyReactComponent);

	Object.keys(omit(components, alreadyRegistered)).forEach(key => {
		if (components[key]) {
			cmf.component.register(key, cmfConnect({})(components[key]));
		}
	});
}
