_package("sudoke.page");

_import("caf.ui.Page");

_class("MenuPage", Page, function(){
	this._init = function(){
		_super._init.call(this);
	};
	this.create = function(parent){
		console.log('menu create');
		var obj = this.createTplElement(parent, "menu.xml");
		this.init(obj);
		return obj;
	};
	this.init = function(){
		console.log('menu init');
		_super.init.apply(this, arguments);
		this.initComponents();
		this.initActionElements();
	};

	this.do_game_new = function(){
		this._app.navPage('loading',{'from':this.pid})

	};

	this.do_game_resume = function(){
		this._app.navPage('home',{'from':this.pid})
	};

	this.do_game_help = function(){
		this._app.navPage('help',{'from':this.pid})
	};

	this.dispose = function(){
		console.log('menu dispose');
		_super.dispose.apply(this);
	};
});
