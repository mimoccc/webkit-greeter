//------------------------------------------------------------------------
// Infinite Array implementation, a qeque array in loop
//------------------------------------------------------------------------

if (!(IArray instanceof Object)) {
	var IArray = function () { this.data = []; };

	// undestructive pop, or just a shift of elements as needed
	IArray.prototype.pop = function () {
		if(this.count()==0) return undefined;
		var i = this.data.shift();
		this.data.push(i);
		return(i);
	};

	// reverse undestructive pop, or just a shift of elements as needed
	IArray.prototype.poprev = function () {
		if(this.count()==0) return undefined;
		var i = this.data.pop();
		this.data.unshift(i);
		return(i);
	};

	// destructive pop
	IArray.prototype.dpop = function () {
		if(this.count()==0) return undefined;
		return(this.data.pop());
	};

	// get element from array by idx, undestructive
	IArray.prototype.get = function (idx) {
		if(this.data.length==0) return undefined;
		var i = idx;
		// if there no item exists, try to go from a array begin
		while(i>(this.data.length-1)) i=i-this.data.length;
		return this.data[i];
	};

	// push item to an array
	IArray.prototype.push = function (item) { this.data.push(item); };

	// count of elements
	IArray.prototype.count = function (item) { return this.data.length; };

	// clear all items
	IArray.prototype.clear = function (item) { this.data = []; };

	// Remove from array
	IArray.prototype.remove = function(from, to) { this.data.remove(from, to); };

};

//------------------------------------------------------------------------