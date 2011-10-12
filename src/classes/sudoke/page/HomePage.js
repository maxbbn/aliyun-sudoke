_package("sudoke.page");

_import("caf.ui.Page");

_class("HomePage", Page, function(){
	this._init = function(){
		_super._init.call(this);
	};
	this.create = function(parent){
		console.log('home create');
		var self = this;
		var obj = this.createTplElement(parent, "home.xml");
		

		sudoku.setTable($('table.board'));
		sudoku.start();
		sudoku.success(function(){
			self._app.showMsgBox('胜利', '你成功了！');
		});
		this.init(obj);
		return obj;
	};
	this.init = function(){
		console.log('home init');
		_super.init.apply(this, arguments);
		this.initComponents();
		this.initActionElements();
	};

	this.do_go_back = function(){
		console.log(this._app);
		this._app.navPage('menu',{'from':this.pid})
	};
	this.dispose = function(){
		console.log('home dispose');
		_super.dispose.apply(this);
	};
	this.reset = function(d){
		console.log('home reset',d);
		sudoku.fillTable();
	};
});
