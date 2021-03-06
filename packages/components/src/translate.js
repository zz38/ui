import i18next, { createInstance } from 'i18next';
import { setI18n, getI18n } from 'react-i18next';

export default function getDefaultT() {
	return getI18n().t.bind(getI18n());
}

export function getCurrentLanguage() {
	if (i18next.language) {
		return i18next.language;
	}
	return 'en';
}

// https://github.com/i18next/i18next/issues/936#issuecomment-307550677
setI18n(createInstance({}, () => {}));
