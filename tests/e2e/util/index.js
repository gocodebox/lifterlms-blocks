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
import openFormSettingsPanel from './open-form-settings-panel';
import publishAndSaveEntities from './publish-and-save-entities';
import removeBlockByClientId from './remove-block-by-client-id';
import visitForm from './visit-form';

export { maybeSkipFormsTests, shouldRunTestsForForms } from './should-run-tests';

export {
	blockSnapshotMatcher,
	clearBlocks,
	openFormSettingsPanel,
	publishAndSaveEntities,
	removeBlockByClientId,
	visitForm,
};
