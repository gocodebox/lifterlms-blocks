/**
 * Export all fields in the fields library.
 *
 * @since 1.6.0
 * @version [version]
 */

// Default Fields.
import * as checkboxes from './fields/checkboxes';
import * as email from './fields/email';
import * as number from './fields/number';
import * as password from './fields/password';
import * as phone from './fields/phone';
import * as radio from './fields/radio';
import * as select from './fields/select';
import * as text from './fields/text';
import * as textarea from './fields/textarea';
import * as url from './fields/url';

// Preset Fields
import * as selectCountry from './fields/select-country';
import * as selectState from './fields/select-state-l10n';

// Composed Fields.
import * as passwordStrengthMeter from './fields/password-strength-meter';
import * as redeemVoucher from './fields/redeem-voucher';

import * as userUsername from './fields/user-username';
import * as userEmail from './fields/user-email';
import * as userEmailConfirm from './fields/user-email-confirm';
import * as userPassword from './fields/user-password';
import * as userPasswordConfirm from './fields/user-password-confirm';
import * as userPasswordCurrent from './fields/user-password-current';
import * as userFirstName from './fields/user-first-name';
import * as userLastName from './fields/user-last-name';
import * as userAddress from './fields/user-address';
import * as userAddressAdditional from './fields/user-address-additional';
import * as userAddressCity from './fields/user-address-city';
import * as userAddressCountry from './fields/user-address-country';
import * as userAddressState from './fields/user-address-state';
import * as userAddressZip from './fields/user-address-zip';
import * as userPhone from './fields/user-phone';

export {

	checkboxes,
	email,
	number,
	password,
	phone,
	radio,
	select,
	text,
	textarea,
	url,

	selectCountry,
	selectState,

	passwordStrengthMeter,
	redeemVoucher,

	userUsername,
	userEmail,
	userEmailConfirm,
	userPassword,
	userPasswordConfirm,
	userPasswordCurrent,
	userFirstName,
	userLastName,
	userAddress,
	userAddressAdditional,
	userAddressCountry,
	userAddressCity,
	userAddressState,
	userAddressZip,
	userPhone,

};
