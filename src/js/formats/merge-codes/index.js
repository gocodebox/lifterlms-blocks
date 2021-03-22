/**
 * Merge Code button on the "Format" toolbar.
 *
 * @see {@link https://developer.wordpress.org/block-editor/tutorials/format-api/}
 *
 * @since 1.6.0
 * @since 1.7.0 Import from `wp.editor` when `wp.blockEditor` is not available.
 * @since 1.8.0 Wrap the rendered content into a `<Fragment>` rather than a `<div>`
 *              to fix issues with Table block.
 * @version 1.6.0
 */

// Local deps.
import LifterLMSIcon from '../../icons/lifterlms-icon';

// WP Deps.
const { RichTextToolbarButton } = wp.blockEditor || wp.editor,
	{ Button, ClipboardButton, Modal, Tooltip } = wp.components,
	{ Component, Fragment } = wp.element,
	{ __ } = wp.i18n,
	{ insert, registerFormatType } = wp.richText;

registerFormatType( 'llms/merge-codes', {
	title: __( 'LifterLMS Merge Codes', 'lifterlms' ),
	tagName: 'span',
	className: 'llms-merge-code',
	edit: class MergeButton extends Component {
		constructor() {
			super( ...arguments );
			// this.onChange = this.onChange.bind( this );
			this.openModal = this.openModal.bind( this );
			this.closeModal = this.closeModal.bind( this );
			this.state = {
				modal: false,
			};
		}

		openModal() {
			this.setState( { modal: true } );
		}

		closeModal() {
			this.setState( { modal: false } );
		}

		insertCode( val, code ) {
			this.closeModal();
			return insert( val, code );
		}

		render() {
			const { value, onChange } = this.props;

			return (
				<Fragment>
					<RichTextToolbarButton
						icon={ <LifterLMSIcon /> }
						title={ __( 'Merge Codes', 'lifterlms' ) }
						onClick={ this.openModal }
					/>
					{ this.state.modal && (
						<Modal
							title={ __( 'LifterLMS Merge Codes', 'lifterlms' ) }
							onRequestClose={ this.closeModal }
						>
							<table>
								<thead>
									<tr>
										<th>{ __( 'Name', 'lifterlms' ) }</th>
										<th>
											{ __( 'Example', 'lifterlms' ) }
										</th>
										<th>
											{ __( 'Merge Code', 'lifterlms' ) }
										</th>
										<th>{ __( 'Insert', 'lifterlms' ) }</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>
											{ __( 'First Name', 'lifterlms' ) }
										</td>
										<td>{ __( 'Steven', 'lifterlms' ) }</td>
										<td>
											<Tooltip
												text={ __(
													'Click to copy.',
													'lifterlms'
												) }
											>
												<ClipboardButton
													text="{{U:FIRST_NAME}}"
													onCopy={ this.closeModal }
												>
													{ '{' }
													{ '{' }U:FIRST_NAME{ '}' }
													{ '}' }
												</ClipboardButton>
											</Tooltip>
										</td>
										<td>
											<Button
												isDefault
												isSmall
												onClick={ () =>
													onChange(
														this.insertCode(
															value,
															'{{U:FIRST_NAME}}'
														)
													)
												}
											>
												{ __( 'Insert', 'lifterlms' ) }
											</Button>
										</td>
									</tr>
								</tbody>
							</table>
						</Modal>
					) }
				</Fragment>
			);
		}
	},
} );
