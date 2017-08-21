'use strict';
define([
	'underscore',
	'react'
], function (_, React) {

	/**
	 * Starts off a new tree.  This will recieve a facet field title like
	 * author_blah_hier, which will return a number of results based on the current
	 * query.
	 */
	var RootNode = React.createClass({

		/**
		 * Supply the initial state of the facet
		 */
		getInitialState: function () {
			return {
				loading: false,
				isOpen: false,
				recievedResponse: false,
				children: []
			};
		},

		/**
		 * Make an api request to retrieve data from the server about the facet
		 */
		makeRequest: function () {
			if (!this.state.recievedResponse) {

				// Start Loading...
				this.setState({ loading: true });

				// Make the api request
				_.debounce(_.partial(this.props.createApiRequest, {
					field: this.props.field
				}, this.onResponse), 100)();
			}
		},

		/**
		 * Handle response from the server.
		 */
		onResponse: function (apiResponse) {
			if (apiResponse === null) {
				return this.setState({ loading: true });
			}

			var items = apiResponse.get('facet_counts')['facet_fields'][this.props.field];
			var children = [];

			// Loop through items array, mapping to new array
			for (var i = 0; i < items.length; i += 2) {
				children.push({
					title: items[i].replace(/^\d\//, ''),
					count: items[i + 1]
				});
			}

			console.log('RESPONSE: ', apiResponse);

			// Update state with new children
			this.setState({
				recievedResponse: true,
				children: children
			}, function () {
				this.setState({ loading: false });
			});
		},

		/**
		 * Toggle the open state of the facet.
		 */
		toggleOpen: function () {

			// Toggle the open state
			this.setState({
				isOpen: !this.state.isOpen
			});

			// Start the request
			this.makeRequest();
		},

		cancelLoading: function () {
			this.setState({
				loading: false,
				isOpen: false
			});
		},

		/**
		 * Render the facet
		 */
		render: function () {
			var self = this;

			// Caret Icon, this will toggle opening the list on click
			var icon = (<i
				className={`facet__icon facet__icon--${(this.state.isOpen) ? 'open' : 'closed'}`}
				role="button"
				aria-pressed="false"
				onClick={this.toggleOpen}>
			</i>);

			// Loading Icon Spinner, this will show if loading == true
			if (this.state.loading) {
				icon = (<i
					className="fa fa-refresh fa-spin fa-fw"
					aria-hidden="true"
					onClick={this.cancelLoading}
				></i>);
			}

			var createChildren = function () {
				var children = self.state.children.map(function (child) {
					return (<LeafNode
						title={child.title}
						count={child.count}
						/>);
				});

				return (
					<div className="facet__list-container">
						<ul className="facet__list">
							<li>
								{children}
							</li>
						</ul>
					</div>
				);
			};

			return (
				<div className="facet__toggle" disabled={this.state.loading}>
					{icon}
					<h3 className="facet__header" onClick={this.toggleOpen}>{this.props.title}</h3>
					<div className="facet__list-container">
						{this.state.children.length && this.state.isOpen ? createChildren() : null}
					</div>
				</div>
			);
		}
	});

	var LeafNode = React.createClass({
		getInitialState: function () {
			return {
				checked: false
			};
		},
		toggleCheckBox: function () {
			this.setState({ checked: !this.state.checked });
		},
		render: function () {
			return (
				<label className="facet-label">
					<input type="checkbox" checked={this.state.checked} onChange={this.toggleCheckBox} />
					&nbsp;
					<span>
						<span className="facet-label__title">{this.props.title}</span>
						<span className="facet-label__amount">{this.props.count}</span>
					</span>
				</label>
			);
		}
	});

	return RootNode;
});