import { getBlockType } from '@wordpress/blocks';
import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { select } from '@wordpress/data';
import { Slot, Fill } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';


import { snakeCase, kebabCase, uniqueId } from 'lodash';

import Field from './field';
import Inspector from './inspect';
import { isUnique } from './checks';
import manageFieldGroupAttributes from './group-data';
import GroupLayoutControl from './group-layout-control';

/**
 * Generate a unique "name" attribute.
 *
 * @since 1.6.0
 * @since [version] Removed '_field' and added the current post id to ensure uniqueness across multiple forms.
 *
 * @param {string} name Base name, generally the field's "field" attribute. EG: "text".
 * @return {string} A unique name, in snake case, suitable to be used as a field's "name" attribute.
 */
const generateName = ( name ) => {
	const { getCurrentPostId } = select( 'core/editor' );
	return snakeCase( uniqueId( `${ name }_${ getCurrentPostId() }_` ) );
};

/**
 * Generate a unique "id" attribute.
 *
 * @since 1.6.0
 *
 * @param {string} name Base name, generally the field's "name" attribute. EG: "text_field_1".
 * @return {string} A unique name, in kebab case, suitable to be used as a field's "id" attribute.
 */
const generateId = ( name ) => {
	return kebabCase( name );
};

/**
 * Sets up block attributes, filling defaults and generating unique values.
 *
 * @since 1.6.0
 * @since 1.12.0 Add data_store_key generation.
 *
 * @param {Object} atts      Default block attributes object.
 * @param {Object} blockAtts Actual WP_Block attributes object.
 * @return {Object} Attribute object suitable for use when registering the block.
 */
const setupAtts = ( atts, blockAtts ) => {
	Object.keys( blockAtts ).forEach( ( key ) => {
		const defaultValue = blockAtts[ key ].__default;
		if (
			'undefined' !== typeof defaultValue &&
			'undefined' === typeof atts[ key ]
		) {
			atts[ key ] = defaultValue;
		}
	} );

	if ( ! atts.name ) {
		let name = generateName( atts.field );
		while ( ! isUnique( 'name', name ) ) {
			name = generateName( atts.field );
		}
		atts.name = name;
	}

	if ( ! atts.id ) {
		let id = generateId( atts.name );
		while ( ! isUnique( 'id', id ) ) {
			id = generateId( uniqueId( `${ atts.field }-field-` ) );
		}
		atts.id = id;
	}

	if ( '' === atts.data_store_key ) {
		atts.data_store_key = atts.name;
	}

	return atts;
};

export function editField( props ) {

	const { name } = props,
		block = getBlockType( name ),
		{ clientId, context, setAttributes } = props,
		inspectorSupports = block.supports.llms_field_inspector,
		editFills = block.supports.llms_edit_fill,
		{ fieldGroupContext, fillEditAfter, fillInspectorControls } = block,
		{ getSelectedBlockClientId } = select( blockEditorStore );

	let { attributes } = props;
	attributes = setupAtts( attributes, block.attributes );

	const blockProps = useBlockProps( { className: 'llms-fields', style: { width: attributes.columns / 12 * 100 + '%' } } );

	// Manage field data for blocks in field groups.
	if ( context['llms/fieldGroup/fieldLayout'] ) {
		manageFieldGroupAttributes( props );
	}

	// We can't disable the variation transformer by context so we'll do it this way which is gross but works.
	useEffect( () => {
		if ( block.variations && block.variations.length && clientId === getSelectedBlockClientId() ) {
			let interval = setInterval( () => {

				let el = document.querySelector( '.block-editor-block-inspector .block-editor-block-variation-transforms' );
				if ( el ) {
					el.style.display = attributes.isConfirmationField ? 'none' : 'inline-block';
					clearInterval( interval );
				}

				return () => {
					clearInterval( interval );
				}

			}, 10 );
		}
	} );

	return (
		<div { ...blockProps }>
			<Inspector
				{ ...{
					attributes,
					clientId,
					name,
					setAttributes,
					inspectorSupports,
					context,
				} }
			/>

			<Field { ...{ attributes, setAttributes, block, clientId, context } } />

			{ inspectorSupports.customFill && (
				<Fill
					name={ `llmsInspectorControlsFill.${ inspectorSupports.customFill }.${ clientId }` }
				>
					{ fillInspectorControls(
						attributes,
						setAttributes,
						props
					) }
				</Fill>
			) }

			{ editFills.after && (
				<Fill
					name={ `llmsEditFill.after.${ editFills.after }.${ clientId }` }
				>
					{ fillEditAfter(
						attributes,
						setAttributes,
						props
					) }
				</Fill>
			) }
		</div>
	);

};

export function editGroup( props ) {

	const {
			attributes,
			clientId,
			name,
			setAttributes
		}                 = props,
		{ fieldLayout }   = attributes,
		{ getBlock }      = select( blockEditorStore ),
		block             = getBlock( clientId ),
		blockType         = getBlockType( name ),
		{
			allowed,
			template,
			lock,
		}                 = blockType.llmsInnerBlocks,
		primaryBlock      = block && block.innerBlocks.length && 'llms/form-field-confirm-group' === block.name ? block.innerBlocks[ blockType.findControllerBlockIndex( block.innerBlocks ) ] : null,
		primaryBlockType  = primaryBlock ? getBlockType( primaryBlock.name ) : null,
		editFills         = primaryBlockType ? primaryBlockType.supports.llms_edit_fill : { after: false },
		inspectorSupports = blockType.supports.llms_field_inspector,
		hasLayout         = blockType.providesContext && blockType.providesContext['llms/fieldGroup/fieldLayout'];

	let orientation = 'columns' === fieldLayout ? 'horizontal' : 'vertical';
	if ( ! hasLayout ) {
		orientation = 'vertical';
	}

	return (
		<div { ...useBlockProps() }>
			<InspectorControls>
				<PanelBody>

					{ hasLayout && (
						<GroupLayoutControl { ...{ ...props, block } } />
					) }

					{ inspectorSupports.customFill && (
						blockType.fillInspectorControls(
							attributes,
							setAttributes,
							props
						)
					) }

				</PanelBody>

			</InspectorControls>

			<div className="llms-field-group" data-field-layout={ hasLayout ? fieldLayout : 'stacked' }>
				<InnerBlocks
					allowedBlocks={ allowed }
					template={ 'function' === typeof template ? template( { attributes, clientId, block, blockType } ) : template }
					templateLock={ lock }
					orientation={ orientation }
				/>
			</div>

			{ editFills.after && (
				<Slot
					name={ `llmsEditFill.after.${ editFills.after }.${ primaryBlock.clientId }` }
				/>
			) }
		</div>
	);
};
