import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router';

import CMFRouteHook from './CMFRouteHook';
import api from '../api';

/**
 * Get component from CMF registry
 * Connect it to CMF if not already connected
 * Pass the view setting to cmfConnect
 * @param view The view setting
 * @param componentId The component id in registry
 * @param context The cmf context
 * @returns {*} The connected component
 */
export function getConnectedComponent(view, componentId, context) {
	const Component = api.component.get(componentId, context);
	if (view && !Component.CMFContainer) {
		return api.route.connectView(context, Component, view);
	} else if (view) {
		return props => <Component {...props} view={view} />;
	}
	return Component;
}

/**
 * Get child routes
 * @param parentPath The parent path
 * @param indexRoute The parent index settings
 * @param childRoutes The child routes settings
 * @param context The cmf context
 * @returns {any[]} The list of Route/CMFRoute child components
 */
function getChildRoutes(parentPath, indexRoute, childRoutes = [], context) {
	const children = childRoutes.map((route, index) => (
		<CMFRoute key={index} {...route} cmfParentPath={parentPath} />
	));

	if (indexRoute) {
		const IndexComponent = getConnectedComponent(
			indexRoute.view,
			indexRoute.component,
			context
		);
		children.push(<Route key={-1} exact path={parentPath} component={IndexComponent} />);
	}

	return children;
}

/**
 * Component wrapper that the Route will mount.
 * @param Component The real component to wrap
 * @param onEnter The enter hook function id in CMF registry
 * @param onLeave The leave hook function id in CMF registry
 * @param props
 * @returns {*} The CMF route wrapper
 */
function CMFRouteComponent({ Component, onEnter, onLeave, ...props }) {
	// Backward compat: add props.params
	const routeComponent = (<Component {...props} params={props.match.params} />);

	if (onEnter || onLeave) {
		return (
			<CMFRouteHook {...props} onEnter={onEnter} onLeave={onLeave}>
				{routeComponent}
			</CMFRouteHook>
		);
	}

	return routeComponent;
}
CMFRouteComponent.propTypes = {
	Component: PropTypes.element,
	onEnter: PropTypes.func,
	onLeave: PropTypes.func,
	match: PropTypes.shape({ params: PropTypes.object }),
};

/**
 * Get route absolute path
 * @param parentPath The route parent path
 * @param path The route path. It is considered as absolute if it starts with /
 * @returns {string} The absolute path
 */
function getSafePath(parentPath = '', path) {
	if (!path.startsWith('/')) {
		if (parentPath.endsWith('/')) {
			return `${parentPath}${path}`;
		}
		return `${parentPath}/${path}`;
	}
	return path;
}


/**
 * @param childRoutes The child routes settings
 * @param cmfParentPath The parent path
 * @param component The component id in CMF registry
 * @param exact Indicates if the route should match the exact path
 * @param indexRoute The route index settings
 * @param onEnter The enter hook function id in CMF registry
 * @param onLeave The leave hook function id in CMF registry
 * @param path The route path
 * @param view The view settings id
 * @param context The CMF context
 * @returns {*} The CMF route
 */
export default function CMFRoute({
	childRoutes,
	cmfParentPath,
	component,
	exact,
	indexRoute,
	onEnter,
	onLeave,
	path,
	view,
}, context) {
	const safePath = getSafePath(cmfParentPath, path);
	const connectedComponent = getConnectedComponent(view, component, context);
	const children = getChildRoutes(safePath, indexRoute, childRoutes, context);

	function RouteComponent(props) {
		return (
			<CMFRouteComponent
				{...props}
				Component={connectedComponent}
				children={children}
				onEnter={onEnter}
				onLeave={onLeave}
				view={view}
			/>
		);
	}

	return (
		<Route
			path={safePath}
			exact={exact}
			component={RouteComponent}
		/>
	);
}

CMFRoute.propTypes = {
	childRoutes: PropTypes.arrayOf(PropTypes.object),
	cmfParentPath: PropTypes.string,
	component: PropTypes.string,
	exact: PropTypes.bool,
	indexRoute: PropTypes.object,
	onEnter: PropTypes.string,
	onLeave: PropTypes.string,
	path: PropTypes.string,
	view: PropTypes.string,
};
CMFRoute.contextTypes = {
	registry: PropTypes.object,
	router: PropTypes.object,
};
CMFRoute.displayName = 'CMFRoute';
