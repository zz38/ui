import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { checkA11y } from '@storybook/addon-a11y';
import talendIcons from '@talend/icons/dist/react';

import { Action, IconsProvider } from '../src/index';

import theme from './Action.scss';

const icons = {
	'talend-dataprep': talendIcons['talend-dataprep'],
};

const myAction = {
	label: 'Click me',
	icon: 'talend-dataprep',
	'data-feature': 'action',
	onClick: action('You clicked me'),
};

const OverlayComponent = <div>I am an overlay</div>;

const mouseDownAction = {
	label: 'Click me',
	icon: 'talend-dataprep',
	'data-feature': 'action',
	onMouseDown: action('You clicked me'),
};

storiesOf('Action', module)
	.addDecorator(checkA11y)
	.addDecorator(story => (
		<div className="col-lg-offset-2 col-lg-8">
			<IconsProvider defaultIcons={icons} />
			{story()}
		</div>
	))
	.addWithInfo('default', () => (
		<div>
			<h3>By default :</h3>
			<Action id="default" {...myAction} />
			<h3>Bootstrap style :</h3>
			<Action id="bsStyle" {...myAction} bsStyle="primary" />
			<Action id="bsStyle" {...myAction} bsStyle="primary btn-inverse" />
			<h3>With hideLabel option</h3>
			<Action id="hidelabel" {...myAction} hideLabel />
			<h3>In progress</h3>
			<Action id="inprogress" {...myAction} inProgress />
			<h3>Loading</h3>
			<Action id="loading" loading />
			<h3>Icon button</h3>
			<Action id="icon" {...myAction} link />
			<h3>Loading Icon button</h3>
			<Action id="icon" link label={'Click me'} loading />
			<h3>Disabled</h3>
			<Action id="disabled" {...myAction} disabled />
			<h3>Reverse display</h3>
			<Action id="reverseDisplay" {...myAction} iconPosition="right" />
			<h3>Transform icon</h3>
			<Action id="reverseDisplay" {...myAction} iconTransform={'rotate-180'} />
			<h3>Custom tooltip</h3>
			<Action id="default" {...myAction} tooltipLabel={'Custom label here'} />
			<h3>OnMouse down handler</h3>
			<Action id="hidelabel" {...mouseDownAction} hideLabel />
			<h3>Action with popover</h3>
			<Action
				id="hidelabel"
				overlayComponent={OverlayComponent}
				overlayPlacement="top"
				tooltipPlacement="right"
				{...mouseDownAction}
				hideLabel
			/>
			<h3>Action in progress</h3>
			<Action
				id="hidelabel"
				inProgress="true"
				overlayComponent={OverlayComponent}
				overlayPlacement="top"
				tooltipPlacement="right"
				{...mouseDownAction}
				hideLabel
			/>
			<h3>
				Automatic Dropup : this is contained in a restricted ".tc-dropdown-container" element.
			</h3>
			<div
				id="auto-dropup"
				className={'tc-dropdown-container'}
				style={{
					border: '1px solid black',
					overflow: 'scroll',
					height: '300px',
					resize: 'vertical',
				}}
			>
				<p>Scroll me to set overflow on top or down of the container, then open the dropdown.</p>
				<div className={theme['storybook-wrapped-action']}>
					<Action
						preventScrolling
						overlayComponent={OverlayComponent}
						overlayPlacement="bottom"
						tooltipPlacement="right"
						{...mouseDownAction}
						hideLabel
						style={{
							marginTop: '200px',
							marginBottom: '200px',
						}}
					/>
				</div>
			</div>
		</div>
	))
	.addWithPropsCombinations('combinations', Action, {
		label: ['Click me'],
		icon: ['talend-dataprep'],
		'data-feature': ['my.feature'],
		onClick: [action('You clicked me')],
		hideLabel: [false, true],
		inProgress: [true, false],
		disabled: [false, true],
		tooltipLabel: [undefined, 'Tooltip custom label'],
	});
