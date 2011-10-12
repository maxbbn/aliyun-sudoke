_package("sudoke.page");

_import("caf.ui.Page");

_class("LoadingPage", Page, function(){
	this._init = function(){
		_super._init.call(this);
	};
	this.create = function(parent){
		var obj = this.createTplElement(parent, "loading.xml");
		this.init(obj);
		return obj;
	};
	this.init = function(){
		_super.init.apply(this, arguments);
		this.initComponents();
		this.initActionElements();
	};
	this.dispose = function(){
		_super.dispose.apply(this);
	};

	this.reset = function(){
		var self = this;
		sudoku.fetch(function(){
			self._app.navPage('home',{'from':this.pid});
		});
	};
});
