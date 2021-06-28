/**
 * E2E Utilities functions
 *
 * @package LifterLMS_Blocks/Tests/E2E/Utils
 *
 * @since 1.12.0
 * @version [version]
 */

import blockSnapshotMatcher from './block-snapshot-matcher';
import clearBlocks from './clear-blocks';
import dragAndDrop from './drag-and-drop';
import openFormSettingsPanel from './open-form-settings-panel';
import publishAndSaveEntities from './publish-and-save-entities';
import removeBlockByClientId from './remove-block-by-client-id';
import visitForm from './visit-form';

export { maybeSkipFormsTests, shouldRunTestsForForms } from './should-run-tests';

export * from './manage-sidebar-plugin';

export {
	blockSnapshotMatcher,
	clearBlocks,
	dragAndDrop,
	openFormSettingsPanel,
	publishAndSaveEntities,
	removeBlockByClientId,
	visitForm,
};
