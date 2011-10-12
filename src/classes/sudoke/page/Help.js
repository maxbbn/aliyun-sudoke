_package("sudoke.page");

_import("caf.ui.Page");

_class("Help", Page, function(){
	this._init = function(){
		_super._init.call(this);
	};
	this.create = function(parent){
		console.log('help create');
		var obj = this.createTplElement(parent, "help.xml");
		this.init(obj);
		return obj;
	};
	this.init = function(){
		console.log('help init');
		_super.init.apply(this, arguments);
		this.initComponents();
		this.initActionElements();
	};

	this.do_game_resume = function(){
		this._app.navPage('menu',{'from':this.pid})
	}

	this.dispose = function(){
		_super.dispose.apply(this);
	};
});
