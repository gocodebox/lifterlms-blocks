const { __ } = wp.i18n
const { Component } = wp.element

export default class Preview extends Component {

	state = {
		terms: false,
	}

	getTerms() {

		const {
			currentPost,
			taxonomy,
		} = this.props

		let link = currentPost._links[ 'wp:term' ].filter( term => term.taxonomy === taxonomy )[0].href;

		wp.apiFetch( { url: wp.url.addQueryArgs( link, { per_page: -1 } ) } ).then( terms => {
			this.setState( { terms: terms.map( term => term.name ) } );
		} );

	}

	componentDidUpdate( lastProps, lastStates ) {

		if ( lastProps.currentPost[ this.props.taxonomy ] !== this.props.currentPost[ this.props.taxonomy ] ) {
			this.getTerms();
		}

	}

	componentWillMount() {
		this.getTerms()
	}

	render() {

		const { terms } = this.state
		const { taxonomy_name } = this.props

		return (

			Array.isArray( terms ) && ! terms.length ? '' : (
				<li><strong>{ taxonomy_name }</strong>: { !! terms ? terms.join( ', ' ) : __( 'Loading...', 'lifterlms' ) }</li>
			)

		)

	}

}
