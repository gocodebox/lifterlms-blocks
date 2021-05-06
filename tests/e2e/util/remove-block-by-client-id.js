
export default async ( clientId ) => {

	return page.evaluate( async ( cid ) => {
		return wp.data.dispatch( 'core/block-editor' ).removeBlock( cid );
	}, clientId );

}
