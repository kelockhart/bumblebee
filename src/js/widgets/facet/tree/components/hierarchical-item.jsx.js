'use strict';
define([
	'underscore',
	'react',
	'js/widgets/facet/tree/utils'
], function (_, React, utils) {

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
				isOpen: this.props.openByDefault,
				recievedResponse: false,
				showReloadButton: false,
				children: [],
				maxPageSize: 5,
				totalChildren: 0,
				page: 0
			};
		},

		/**
		 * Make an api request to retrieve data from the server about the facet
		 */
		makeRequest: function () {
			var self = this;
			if (!this.state.recievedResponse) {

				// Start Loading...
				this.setState({
					loading: true
				}, function () {
					// After UI Updates, make the api request
					_.debounce(_.partial(this.props.createApiRequest, {
						field: this.props.field,
						offset: this.state.page * this.state.maxPageSize,
						hierarchical: true
					}, function (promise) {
						promise
							.done(self.onResponse)
							.fail(self.handleRequestFailure);
					}), 100)();
				});
			}
		},

		/**
		 * Called initially when the component is mounted on the DOM
		 * If the node is openByDefault then we should make an initial request
		 */
		componentWillMount: function () {

			// if open initially, make request on mount
			if (this.props.openByDefault) {
				this.makeRequest();
			}
		},

		/**
		 * Called when the component props have been updated in some way
		 * does not necessarily mean we will update, must be comparisons done
		 */
		componentWillReceiveProps: function (props) {

			// There was an error during the request, attempt to handle it
			if (props.hasError && !this.state.recievedResponse) {
				this.handleRequestFailure();
			}

			// see if there was a new query, compare current with new
			var isNewQuery = !utils.isEqual(props.query, this.props.query);

			// new query and we are open, reload
			if (isNewQuery && this.state.isOpen) {
				this.setState({
					recievedResponse: false,
					loading: true,
					isOpen: false
				}, this.makeRequest);

				// new query and we are closed, reset so we'll get a reload when opening
			} else if (isNewQuery && !this.state.isOpen) {
				this.setState({
					recievedResponse: false,
					children: []
				});
			}
		},

		/**
		 * If the is an error during the request, capture and handle here
		 */
		handleRequestFailure: function () {

			// Stop loading and show the reload button
			this.setState({
				loading: false,
				isOpen: false,
				showReloadButton: true
			});
		},

		/**
		 * Handle response from the server.
		 */
		onResponse: function (apiResponse) {
			console.log('DONE', apiResponse);
			var items = apiResponse.get('facet_counts')['facet_fields'][this.props.field];
			var totalItems = apiResponse.get('response').docs.numFound;
			var offset = apiResponse.get('responseHeader').params['facet.offset'];
			var children = [];

			// if there have been some paging, we want to
			if (offset && Number(offset) > 0) {
				children = this.state.children;
			}

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
				children: children,
				showReloadButton: false,
				isOpen: true,
				totalChildren: totalItems
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

		// cancel loading the request
		cancelLoading: function () {
			this.setState({
				loading: false,
				isOpen: false
			});
		},

		updatePage: function (value) {
			this.setState({
				page: this.state.page + value
			}, function () {

				// check to see if we must make a request to get more
				if (this.state.page * this.state.maxPageSize % 20 === 0) {
					this.setState({
						recievedResponse: false
					}, function () {
						this.makeRequest();
					});
				}
			});
		},

		/**
		 * Render the facet
		 */
		render: function () {
			var self = this;

			var createCaretIcon = function () {
				return (<i
					className={`facet__icon facet__icon--${(self.state.isOpen) ? 'open' : 'closed'}`}
					role="button"
					aria-pressed="false"
					onClick={self.toggleOpen}>
				</i>);
			};

			var createLoadingIcon = function () {
				return (<i
					className="fa fa-refresh fa-spin fa-fw face__icon--loading"
					aria-hidden="true"
					onClick={self.cancelLoading}
				></i>);
			};

			var createReloadIcon = function () {
				return (<i
					className="fa fa-refresh fa-fw facet__icon--reload"
					role="button"
					aria-hidden="true"
					onClick={self.toggleOpen}
				></i>);
			};

			var createChildren = function () {

				// calculate the number of children to show
				var shown = (self.state.page + 1) * self.state.maxPageSize;

				var children = self.state.children.map(function (child, index) {

					// check to see if this child is shown on the current page
					if (index > shown - 1) {
						return null;
					}

					return (<ChildNode
						title={child.title}
						count={child.count}
						field={self.props.field}
						createApiRequest={self.props.createApiRequest}
					/>);
				});
				return children;
			};

			var createPaginationButtons = function (more, less) {
				var classes = 'btn btn-default btn-xs facet__pagination-button';
				var increase = _.partial(self.updatePage, 1);
				var decrease = _.partial(self.updatePage, -1);
				return (
					<div className="facet__pagination-container">
						{ (less) ? <button
							className={classes}
							onClick={decrease}
						>less</button> : null }
						{ (more) ? <button
							className={classes}
							onClick={increase}
						>more</button> : null }
					</div>
				);
			};

			// control which icon should show
			var icon = null;
			switch(true) {
				case this.state.loading:
					icon = createLoadingIcon(); break;
				case this.state.showReloadButton:
					icon = createReloadIcon(); break;
				default:
					icon = createCaretIcon();
			}

			// control which pagination buttons should show
			var pager = null;
			if (this.state.children.length > this.state.maxPageSize) {
				if (this.state.loading || !this.state.isOpen) {
					pager = null;
				}
				switch(this.state.page) {
					case 0:
						pager = createPaginationButtons(true); break;
					case this.state.totalChildren / this.state.maxPageSize:
						pager = createPaginationButtons(false, true); break;
					default:
						pager = createPaginationButtons(true, true);
				}
			};

			return (
				<div className="facet__toggle" disabled={this.state.loading}>
					{icon}
					<h3 className="facet__header" onClick={this.toggleOpen}>{this.props.title}</h3>
					<div className="facet__list-container">
						{this.state.children.length && this.state.isOpen ? createChildren() : null}
						{pager}
					</div>
				</div>
			);
		}
	});

	var ChildNode = React.createClass({

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
					field: this.props.field,
					title: this.props.title,
					hierarchical: true
				}, this.onResponse), 100)();
			}
		},

		/**
		 * Handle response from the server.
		 */
		onResponse: function (apiResponse) {
			if (apiResponse === null) {
				return;
			}

			// Get facet counts based on title
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

		toggleCheckBox: function () {
			console.log('toggleCheckbox');
			this.setState({ checked: !this.state.checked });
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
			var nodeIconTitle = (this.state.isOpen) ?
				'Expand ' : 'Collapse ' + this.props.title;

			var createCaretIcon = function () {
				return (<i
					className={`facet__icon facet__icon--${(self.state.isOpen) ? 'open' : 'closed'}`}
					role="button"
					aria-pressed="false"
					title={nodeIconTitle}
					onClick={self.toggleOpen}>
				</i>);
			};

			var createLoadingIcon = function () {
				return <i
					className="fa fa-refresh fa-spin fa-fw"
					aria-hidden="true"
					title={`Loading ${self.props.title}`}
					onClick={self.cancelLoading}
				></i>;
			};

			var createChildren = function () {
				var children = self.state.children.map(function (child) {
					return (<LeafNode
						title={child.title}
						count={child.count}
						checked={self.state.checked}
						/>);
				});

				return (
					<div className="facet__list-container facet__list-container--child">
						<ul className="facet__list">
							<li>
								{children}
							</li>
						</ul>
					</div>
				);
			};

			var createLabel = function () {
				return (
					<label className="facet-label">
						<input type="checkbox" checked={self.state.checked} onChange={self.toggleCheckBox} />
						&nbsp;
						<span>
							<span className="facet-label__title">{self.props.title}</span>
							<span className="facet-label__amount">{self.props.count}</span>
						</span>
					</label>
				);
			};

			return (
				<div className="facet__list-container">
					<ul className="facet__list">
						<li>
							<div className="facet__toggle"
								title={nodeIconTitle}
								disabled={this.state.loading}
								>
								{this.state.loading ? createLoadingIcon() : createCaretIcon()}
								{createLabel()}
								{
									this.state.children.length && this.state.isOpen ?
									createChildren() : null
								}
							</div>
						</li>
					</ul>
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
		componentWillReceiveProps: function (props) {
			this.setState({ checked: props.checked });
		},
		render: function () {

			var title = utils.splitTitle(this.props.title);

			return (
				<label className="facet-label">
					<input type="checkbox" checked={this.state.checked} onChange={this.toggleCheckBox} />
					&nbsp;
					<span>
						<span className="facet-label__title">{title}</span>
						<span className="facet-label__amount">{this.props.count}</span>
					</span>
				</label>
			);
		}
	});

	return RootNode;
});