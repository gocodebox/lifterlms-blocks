const { __ } = wp.i18n
const {
	Component,
	Fragment,
} = wp.element

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
			this.setState( { terms: terms } );
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

	renderTerms( terms ) {
		const last = terms.length - 1
		return (
			<Fragment>
				{ !! terms ? terms.map( ( term, index ) => this.renderTerm( term, ( last === index ) ) ) : __( 'Loading...', 'lifterlms' ) }
			</Fragment>
		);
	}

	renderTerm( term, last ) {
		return (
			<Fragment>
				<a href={ term.link } target="_blank">{ term.name }</a>
				{ last ? '' : ', ' }
			</Fragment>
		);
	}

	render() {

		const { terms } = this.state
		const { taxonomy_name } = this.props

		return (

			Array.isArray( terms ) && ! terms.length ? '' : (
				<li><strong>{ taxonomy_name }</strong>: { this.renderTerms( terms ) }</li>
			)

		)

	}

}
