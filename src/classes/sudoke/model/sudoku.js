function Sudoku(config){
	this.config = _.extend({
		offline : false
	},config)
	this.init();
}
_.extend(Sudoku, {
	api : "http://query.yahooapis.com/v1/public/yql?"+
				"q=%20SELECT%20*%20FROM%20html%20WHERE%20url%3D%22http%3A%2F%2Fwidget.websudoku.com%2F%3Flevel%3D{{lv}}%22%20"+
				"and%20xpath%3D%22%2F%2Ftable%5B%40class%3D't'%5D%2Ftr%2Ftd%2Finput%2F%40value%22&format=json&diagnostics=true",
	getCol : function (col, lines){
		var out = [];
		_.times(lines.length, function(idx){
			out.push(lines[idx][col]);
		});
		return out;
	},

	getGrid : function (index, lines){
		// console.log('p',row,col)
		var rfrom = Math.floor(index/3),
			rto = rfrom + 3,
			cfrom = (index % 3) * 3,
			cto = cfrom + 3,
			grids = [];
		// console.log(rrange,crange)
		for(var row = rfrom; row < rto; row ++){
			for(var col = cfrom; col < cto; col ++){
				grids.push(lines[row][col]);
			}

		}

		return grids;
	},

	getBlank : function (){
		var lines = [];
		_.times(9,function(){
			var line = [];
			_.times(9,function(){
				line.push(0);
			});
			lines.push(line);
		});
		return lines;
	},

	echo : function (title, lines){
		if(typeof title === 'string'){
			console.log('- - - -', title,' - - - - ');	
		}else{
			lines = title;
		}
		if(typeof lines !== 'object'){
			console.log(lines);
		}else if(typeof lines[0] !== 'object'){
			console.log(lines.join('  '));
		}else{
			_(lines).each(function(line){
				console.log(line.join('  '));
			});
		}
		console.log('- - - - - - - - ');
	}

});
_.extend(Sudoku.prototype, {

	checkError : function (){
		var self = this,
			lines = self.lines;
		if(!lines)
			return;
		var errorrow = -1,
			errorcol = -1,
			errorgrid = -1;

		_(lines).each(function(row,rowidx){
			if(errorrow === -1 && _(row).compact().length < 9){
				errorrow = rowidx
			}
		});

		if(errorrow !== -1){
			return [errorrow, -1, -1];
		}

		_.times(9, function(idx){
			var col = Sudoku.getCol(idx,lines);
			if(errorcol === -1 && _(col).compact().length < 9) {
				errorcol = idx;
			}
		});

		if(errorcol !== -1)
			return [-1 , errorcol, -1];

		_.times(9, function(idx){
			var dict = Sudoku.getGrid(idx,lines);
			if(errorgrid === _(dict).compact().length < 9) {
				errorgrid = idx;
			}
		});

		if(errorgrid !== -1)
			return [-1 , -1, errorgrid];

		return false;
	},

	init : function (){
		var self = this;
		console.log('init sudoku');
		self.successcbs = [];
	},

	stop : function(){
		if(self.timeout)
			clearTimeout(self.timeout);
	},

	destory : function(){
	},

	success : function(cb){
		this.successcbs.push(cb);
		console.log(this.successcbs);
	},

	start : function(){
		var self = this,
			table = this.table;

		table.find('input').each(function(idx, input){
			var row = Math.floor(idx / 9),
				col = idx%9;
			$(input).attr('data-position', row + ':' + col);
		});

		table.delegate('input', 'keyup', function(ev){
			var pos = $(this).attr('data-position').split(':');

			pos = _(pos).map(function(num){
				return Number(num);
			});

			self.lines[pos[0]][pos[1]] = $(this).val()
			// Sudoku.echo('change',self.lines);
		});

		self.timeout = setTimeout(function check(){
			var error = self.checkError();
			console.log(error);
			if(!error){
				self.onSuccess();
			}else{
				self.timeout = setTimeout(check, 1000);
			}
		}, 1000);
	},

	onSuccess : function(){
		console.log('success');
		debugger;
		var self = this;
		if(self.successcbs){
			_.each(self.successcbs, function(cb){
				cb.call(self);
			});
		}
	},

	fetch : function(cb){
		var self = this,
			api = Sudoku.api.replace('{{lv}}',level),
			level = this.getLevel();

		self.lines = Sudoku.getBlank();
		function proccessData (data){
			_(data.query.results.input).each(function(item){
				//console.log(item, item.id);
				var row = Number(item.id[2]);
				var col = Number(item.id[1]);
				self.lines[row][col] = Number(item.value);
			});

			if(cb) cb.call(null);
		}

		if(self.config.offline){
			proccessData(sudokesample);
			return;
		}
		$.ajax({
			url : api,
			dataType : 'jsonp',
			cache : false
		}).success(function(data){

			if(data.error){
				//console.log('error',data.error);
				if(cb) cb.call(this,error);
				return;
			}

			proccessData(data);
		});
	
	},

	fillTable : function (table){
		//console.log(lines);
		var self = this,
			lines = self.lines,
			table = self.table,
			alldata = _(lines).flatten();

		table.find('td.blank')
			.removeClass('blank')

		table.find('input').each(function(idx,item){
			var num = alldata[idx];
			if(num === 0){
				$(item).val('').prop('readonly',false).attr('tabindex', '')
					.parent().addClass('blank');
			}else{
				$(item).val(num).prop('readonly',true).attr('tabindex', '-1')
					.parent().removeClass('blank');
			}
		});

		var numdial = $('#numdial');

		table.bind('touchstart', function(ev){
		}).bind('click', function(ev){
		}).delegate('input', 'focus', function(ev){
		}).bind('touchmove',function(){
		});
	},

	setTable : function(table){
		this.table = $(table);
	},

	score : function (s){
		var ret,self = this;
		if(typeof s === 'undefined'){
			ret = localStorage.getItem('sudoku-score');
			if(!ret){
				ret = 0;
				self.score(0);
			}
			return Number(ret);
		}else{
			localStorage.setItem('sudoku-score',s);
		}
	},

	getLevel : function (){
		var score = this.score();
		var level = score < 5 ? 1 :
			(scroe < 100 ) ? 2 :
				(score < 200) ? 3 : 4;
		return level;
	}
});

var sudoku = new Sudoku({
	offline : false
});
