import mock from '../src/mock';
import actionCreatorAPI from '../src/actionCreator';
import { create } from 'domain';

describe('CMF action', () => {
	let context;

	beforeEach(() => {
		context = mock.context();
	});

	it('get should return a function', () => {
		const id = 'myactioncreator';

		function creator() {}
		context.registry = {};
		context.registry[`actionCreator:${id}`] = creator;
		const actionCreator = actionCreatorAPI.get(context, id);
		expect(typeof actionCreator).toBe('function');
	});

	it('get should throw an error', () => {
		const id = 'myactioncreator';
		context.registry = {};
		const test = () => actionCreatorAPI.get(context, id);
		expect(test).toThrowError(`actionCreator not found in the registry: ${id}`);
	});

	it('should register an actionCreator in context', () => {
		const creator = jest.fn();
		const id = 'myactioncreator';
		context.registry = {};
		actionCreatorAPI.register(id, creator, context);

		expect(context.registry).toEqual({
			'actionCreator:myactioncreator': creator,
		});
	});
});
