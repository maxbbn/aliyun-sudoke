_package("sudoke.page");

_import("caf.ui.Page");

_class("Welcome", Page, function(){
	this._init = function(){
		_super._init.call(this);
	};
	this.create = function(parent){
		var obj = this.createTplElement(parent, "welcome.xml");
		this.init(obj);
		var self = this;
		$('div.logo').fadeIn('slow',function(){
			setTimeout(function(){
				self._app.navPage('menu',{'from':self.pid})
			}, 1500)
		});
		return obj;
	};
	this.init = function(){
		_super.init.apply(this, arguments);
		this.initComponents();
		this.initActionElements();
		var self = this;
	};
	this.dispose = function(){
		_super.dispose.apply(this);
	};
});
