_package("sudoke");

_import("caf.core.AppBase");
_import("caf.ui.Button");

_class("Appsudoke", AppBase, function(){
	this.__conf__({
		"tags" : [
			{"tag": "a:button"   , "clazz": "Button"   },
		],
		"page": [
			//键(pageid)     模板文件名         类名                 简要说明
			{"pid": "welcome", "tpl": "welcome.xml", "clazz": "Welcome"},
			{"pid": "menu", "tpl": "menu.xml", "clazz": "MenuPage"},
			{"pid": "help", "tpl": "help.xml", "clazz": "Help"},
			{"pid": "home", "tpl": "home.xml", "clazz": "HomePage"},
			{"pid": "loading", "tpl": "loading.xml", "clazz": "LoadingPage"}
		]
	});
	this._init = function(){
		_super._init.call(this);
	};
	this.init = function(){
		_super.init.apply(this, arguments);
		this._taglib.regTags(this.findConf("tags"));
		//注册模板库
		this._template.reg(runtime.getTplData("sudoke.tpl"));
		this._deckPage.create(runtime.getWorkspace(), this, this._history);
		this.reset();
	};
	this.reset = function(){
		_super.reset.apply(this, arguments);
		this._deckPage.reset();
		this.navPage("welcome");
	};
	this.dispose = function(){
		_super.dispose.apply(this);
	};
});
