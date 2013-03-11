if (!(CollapsibleList instanceof Object)) {

	var CollapsibleList = function (id, where_to) {

		this.id = id;
		this.renderedTo = where_to;

		this.canvas = mjdevjs.me(mjdevjs.DOM_TYPE_DIV, id, 'coll_list', where_to);

		this.add = function (mixed) {

			this.canvas.innerHTML += mixed;
			// to do collapsed items

		};

	}

}
