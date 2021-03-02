/**
 * Main Block editor entry point.
 *
 * @since 1.0.0
 * @since 1.5.0 Register blocks conditionally based on post type.
 * @since 1.6.0 Register form field blocks.
 * @since 1.7.0 Refactor into multiple files for clarity and organization.
 * @since [version] Disable import of incomplete module `./formats/merge-codes`;
 */

// SCSS.
import '../scss/blocks.scss';

// Internal Deps.
import './block-visibility/'
import './dom-ready/';
import './post-visibility/'
// import './formats/merge-codes/';
import './sidebar/'

// Register all Core Blocks.
import registerBlocks from './blocks/';
registerBlocks();

// Import core Components and expose them for 3rd parties to utilize.
import Components from './components/';
window.llms.components = Components;
