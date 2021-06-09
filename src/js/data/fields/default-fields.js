// Internal dependencies.
import { fieldsArrayToObject } from './util';

/**
 * Default fields object
 *
 * @since [version]
 *
 * @type {Object}
 */
export const DEFAULT_FIELDS = fieldsArrayToObject(
	window.llms.userInfoFields.map( ( field ) => ( {
		...field,
		isPersisted: true,
	} ) )
);
