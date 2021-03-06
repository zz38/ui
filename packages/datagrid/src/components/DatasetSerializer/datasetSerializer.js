import get from 'lodash/get';
import isArray from 'lodash/isArray';
import round from 'lodash/round';

import {
	NAMESPACE_INDEX,
	NAMESPACE_DATA,
	COLUMN_INDEX,
	QUALITY_KEY,
	QUALITY_INVALID_KEY,
	QUALITY_EMPTY_KEY,
	QUALITY_VALID_KEY,
} from '../../constants/';

/**
 * sanitizeAvro - remove the optional type
 *
 * @param  {object} 	avro field
 * @return {object}   return the shallow avro
 * @example
 * 	sanitizeAvro({
 *		 "name": "field0",
 *		 "doc": "Nom de la gare",
 *		 "type": [
 *			 "null",
 *			 {
 *				 "type": "string",
 *				 "dqType": "FR Commune",
 *				 "dqTypeKey": "FR_COMMUNE"
 *			 }
 *		 ],
 *		 "@talend-quality@": {
 *				 "0": 0,
 *				 "1": 38,
 *				 "-1": 62,
 *				 "total": 100
 *		 }
 *	}); {..., type: {type: "string", dqType: "FR Commune", dqTypeKey: "FR_COMMUNE"}}
 */
export function sanitizeAvro(avro) {
	if (!isArray(avro.type)) {
		return avro;
	}

	return {
		...avro,
		type: avro.type.find(subType => subType.type !== 'null'),
	};
}

/**
 * Extract the value of type from { type: string, dqType: string }
 * If the type is optional, add a '*'
 * @param {object} type;
 * @param {boolean} optional;
 */
export function getTypeValue(type, optional) {
	return `${type.dqType || type.type}${optional ? '' : '*'}`;
}

/**
 * getType - manage the type from an AVRO type
 *
 * @param  {array|object} 	avro type
 * @return {string} return the type showed in the datagrid
 * @example
 */
export function getType(type) {
	if (Array.isArray(type)) {
		return getTypeValue(
			type.find(subType => subType.type !== 'null'),
			type.find(subType => subType.type === 'null'),
		);
	}
	return getTypeValue(type);
}

export function getQuality(qualityTotal, rowsTotal) {
	return {
		percentage: rowsTotal ? round((qualityTotal / rowsTotal) * 100) : 0,
		total: qualityTotal,
	};
}

/**
 * Extract the quality from the type.
 * @param {object or array} type
 */
export function getQualityValue(type) {
	if (isArray(type)) {
		return type.find(value => value[QUALITY_KEY] !== undefined)[QUALITY_KEY];
	}
	return type[QUALITY_KEY];
}

export function getFieldQuality(type) {
	if (!type) {
		return {};
	}
	const quality = getQualityValue(type);
	return {
		[QUALITY_INVALID_KEY]: getQuality(quality[QUALITY_INVALID_KEY], quality.total),
		[QUALITY_EMPTY_KEY]: getQuality(quality[QUALITY_EMPTY_KEY], quality.total),
		[QUALITY_VALID_KEY]: getQuality(quality[QUALITY_VALID_KEY], quality.total),
	};
}

export function convertSample(sample) {
	if (sample.toJS) {
		return sample.toJS();
	}

	return sample;
}

export function getColumnDefs(sample) {
	if (!sample) {
		return [];
	}

	const plainObjectSample = convertSample(sample);

	return get(plainObjectSample, 'schema.fields', []).map(avroField => ({
		avro: sanitizeAvro(avroField),
		field: `${NAMESPACE_DATA}${avroField.name}`,
		headerName: avroField.doc,
		type: getType(avroField.type),
		[QUALITY_KEY]: getFieldQuality(avroField.type),
	}));
}

export function getRowData(sample, startIndex = 0) {
	if (!sample) {
		return [];
	}

	const plainObjectSample = convertSample(sample);

	return get(plainObjectSample, 'data', []).map((row, index) =>
		Object.keys(row.value).reduce(
			(rowData, key) => ({
				...rowData,
				[`${NAMESPACE_DATA}${key}`]: {
					value: row.value[key].value,
					quality: row.value[key].quality,
					comments: [],
					avro: {},
				},
			}),
			{
				[`${NAMESPACE_INDEX}${COLUMN_INDEX}`]: index + startIndex,
				loading: !!row.loading,
			},
		),
	);
}

export function getPinnedColumnDefs(sample) {
	if (!sample) {
		return [];
	}

	return [
		{
			field: `${NAMESPACE_INDEX}${COLUMN_INDEX}`,
			width: 100,
		},
	];
}

export function getCellValue({ colDef, data }) {
	return data[colDef.field];
}
