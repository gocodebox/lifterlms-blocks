/**
 * Main Block editor entry point.
 *
 * @since 1.0.0
 * @version 2.4.0
 */

// SCSS.
import '../scss/blocks.scss';

// Internal Deps.
import './block-visibility/';
import './dom-ready/';
import './post-visibility/';
import './formats/shortcodes/';
import './sidebar/';
import './data/';

// Register all Core Blocks.
import registerBlocks from './blocks/';
registerBlocks();

// Preserve components from `@lifterlms/components`.
const { components = {} } = window.llms;

// Import core Components and expose them for 3rd parties to utilize.
import * as Components from './components/';
window.llms.components = {
	...components,
	...Components,
};
