export default {
	REGISTRY_EXPRESSION_PREFIX: 'expression',
	REGISTRY_COMPONENT_PREFIX: '_.route.component',
	REGISTRY_HOOK_PREFIX: '_.route.hook',
	REGISTRY_ACTION_CREATOR_PREFIX: 'actionCreator',
	SAGA_PREFIX: 'saga',
	DID_MOUNT_SAGA_START: 'DID_MOUNT_SAGA_START',
	WILL_UNMOUNT_SAGA_STOP: 'WILL_UNMOUNT_SAGA_STOP',
	IS_HANDLER: 'on',
	IS_HANDLER_DISPATCH: 'Dispatch',
	IS_HANDLER_ACTION_CREATOR: 'ActionCreator',
	IS_HANDLER_DISPATCH_REGEX: /^(on).*(Dispatch)$/,
	IS_HANDLER_ACTION_CREATOR_REGEX: /^(on).*(ActionCreator)$/,
	IS_HANDLER_SETSTATE: 'SetState',
	IS_HANDLER_SETSTATE_REGEX: /^(on).*(SetState)$/,
	ERROR_ROUTER_DONT_GET_PARAMS:
		'You can t get params because it will change on every state mutation. Please take one of the params only',
};
