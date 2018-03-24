var game = {
	data: null, //游戏启动后是一个二维数组，用来存储每个格的数字
	RN: 4, // 总行数
	CN: 4, //总列数
	score: 0,
	state: 0, //保存游戏状态
	RUNNING: 1, //游戏正在运行
	GAMEOVER: 0, //游戏结束
	start: function() { //游戏启动时调用
		this.state = this.RUNNING; //表示游戏启动
		//初始化数组为RN行，CN列二维数组，所有元素为0
		this.data = [
		 
		];
		for(var r = 0; r < this.RN; r++) {
			this.data[r] = [];
			for(var c = 0; c < this.CN; c++) {
				this.data[r][c] = 0;
			}
		}
		this.score = 0; //游戏开始 ，初始化分数为0
		//随机生成2个2或4
		this.randomNum();
		this.randomNum();
		this.updateView(); //将data的数据更新到页面
		//console.log(this.data.join("\n"));
	},
	isGameOver: function() { //专门判断游戏是否结束
		//遍历data中所有元素
		//     如果当前元素值==0，说明没有结束  
		//			返回false
		//	       否则： 如果当前列不是最右侧列，且当前元素等于右侧元素，
		//			返回false
		//	      否则： 如果当前行不是最后一行， 且当前元素等于下方元素，
		//			返回false
		//(遍历结束) 游戏状态改为gameover 返回true
		for(var r = 0; r < this.data.length; r++) {
			for(var c = 0; c < this.data[r].length; c++) {
				if(this.data[r][c] == 0) {
					return false;
				} else {
					if(c != this.data[r].length - 1 && this.data[r][c] == this.data[r][c + 1]) {
						return false;
					} else if(r != this.data.length - 1 && this.data[r][c] == this.data[r + 1][c]) {
						return false;
					}
				}
			}
		}
		this.state = this.GAMEOVER;
		return true;
	},
	randomNum: function() { //随机挑选一个位置，生成2或4
		if(!this.isFull()) {
			while(true) { //反复执行
				//随机生成一个行下标，保存在r中
				var r = parseInt(Math.random() * (this.RN));
				//随机生成一个列下标，保存在c中
				var c = parseInt(Math.random() * (this.CN));
				//如果data中r行c列的值==0
				if(this.data[r][c] == 0) {
					//随机生成2或4，放入r行c列的元素中
					//生成一个随机数<0.5,就放入2，否则放4
					this.data[r][c] = Math.random() < 0.5 ? 2 : 4;
					//退出循环
					break;
				}

			}
		}

	},

	isFull: function() { //专门用来判断数组是否已满
		for(var r = 0; r < this.data.length; r++) {
			for(var c = 0; c < this.data[r].length; c++) {
				if(this.data[r][c] == 0) {
					return false;
				}
			}
		}
		return true;
	},
	updateView: function() { //负责将data中每个元素刷到页面中，并修改页面每个div的class值
		for(var r = 0; r < this.data.length; r++) {
			for(var c = 0; c < this.data[r].length; c++) {
				var div = document.getElementById("c" + r + c);
				if(this.data[r][c] != 0) {
					//找到页面中和当前元素对应位置的div
					//将当前元素值放到
					div.innerHTML = this.data[r][c];
					div.className = "cell n" + this.data[r][c];
				} else { //否则，重置
					div.className = "cell";
					div.innerHTML = "";
				}
			}
		}
		/*将分数写到页面*/
		var span = document.getElementById("score");
		span.innerHTML = this.score;

		//找到gameover
		var gameover = document.getElementById("gameover");

		if(this.state == this.GAMEOVER) {
			var span=document.getElementById("finalScore");
			span.innerHTML = this.score;
			//修改gameover的display  block
			gameover.style.display = "block";
		} else {
			gameover.style.display = "none";
		}
	},
	moveLeft: function() {
		var before = this.data.toString();

		for(var r = 0; r < this.data.length; r++) {
			this.moveLeftInRow(r);
		}
		var after = this.data.toString();
		if(before != after) {
			this.randomNum();
			this.isGameOver();
			this.updateView();
		}

	},
	moveLeftInRow: function(r) {
		for(var c = 0; c < this.data[r].length - 1; c++) { //c是列，从0开始 到 length-1结束，最后一个没有必要比较
			var next = this.getRightNext(r, c);
			if(next == -1) {
				break;
			} else {
				if(this.data[r][c] == 0) {
					this.data[r][c] = this.data[r][next];
					this.data[r][next] = 0;
					c--;
				} else if(this.data[r][c] == this.data[r][next]) {
					this.data[r][c] *= 2;
					this.data[r][next] = 0;
					this.score += this.data[r][c];
				}
			}
		}
	},
	getRightNext: function(r, c) { //找当前位置右侧下一个
		//从c+1开始遍历之后的所有元素
		for(var next = c + 1; next < this.data[r].length; next++) {
			if(this.data[r][next] != 0) {
				return next;
			}
		}
		return -1;
		//如果找到 !=0的	
	},

	moveRight: function() {
		var before = this.data.toString();

		for(var r = 0; r < this.data.length; r++) {
			this.moveRightInRow(r);
		}
		var after = this.data.toString();
		if(before != after) {
			this.randomNum();
			this.isGameOver();
			this.updateView();
		}
	},

	moveRightInRow: function(r) {
		//c从length-1开始，到1结束。
		//找左侧下一个不为0的数的下标，返回prev
		//如果prev==-1，直接break
		//否则，   如果自己==0，用prev位置的元素替换当前元素，将prev位置的元素设置为0，c右移一位
		//      否则 ，自己和prev位置的元素相等，就将自己位置的元素 ×2，将prev位置设置为0;
		for(var c = this.data[r].length - 1; c > 0; c--) {
			var prev = this.getLeftPrev(r, c);
			if(prev == -1) {
				break;
			} else {
				if(this.data[r][c] == 0) {
					this.data[r][c] = this.data[r][prev];
					this.data[r][prev] = 0;
					c++;
				} else if(this.data[r][c] == this.data[r][prev]) {
					this.data[r][c] *= 2;
					this.data[r][prev] = 0;
					this.score += this.data[r][c];
				}

			}
		}

	},
	getLeftPrev: function(r, c) {
		//从c-1开始，到0结束。
		for(var prevC = c - 1; prevC >= 0; prevC--) {
			if(this.data[r][prevC] != 0) {
				return prevC;
			}
		}
		return -1;
	},

	moveUp: function() {
		var before = this.data.toString();

		for(var c = 0; c < this.CN; c++) {
			this.moveUpInCol(c);
		}
		var after = this.data.toString();
		if(before != after) {
			this.randomNum();
			this.isGameOver();
			this.updateView();
		}
	},
	moveUpInCol: function(c) {
		for(var r = 0; r < this.RN - 1; r++) {
			//查找r行c列下方下一个不为0的位置nextr
			var next = this.getDownNext(r, c);
			//如果没找到,就退出循环
			if(next == -1) {
				break;
			} else { //否则
				//如果r位置c列的值为0
				if(this.data[r][c] == 0) {
					//将nextr位置c列的值赋值给r位置
					this.data[r][c] = this.data[next][c];
					//将nextr位置c列置为0
					this.data[next][c] = 0;
					r--; //r留在原地
				} else if(this.data[r][c] ==
					this.data[next][c]) {
					//否则，如果r位置c列的值等于nextr位置的值
					//将r位置c列的值*2
					this.data[r][c] *= 2;
					//将nextr位置c列的值置为0
					this.data[next][c] = 0;
					this.score += this.data[r][c];
				}
			}
		}
	},
	getDownNext: function(r, c) {
		for(var r_ = r + 1; r_ < this.CN; r_++) {
			if(this.data[r_][c] != 0) {
				return r_;
			}
		}
		return -1;
	},

	moveDown: function() {
		var before = this.data.toString();

		for(var c = 0; c < this.CN; c++) {
			this.moveDownInCol(c);
		}
		var after = this.data.toString();
		if(before != after) {
			this.randomNum();
			this.isGameOver();
			this.updateView();
		}
	},
	moveDownInCol: function(c) {
		for(var r = this.RN - 1; r > 0; r--) {
			//查找r行c列下方下一个不为0的位置nextr
			var prev = this.getUpPrev(r, c);
			//如果没找到,就退出循环
			if(prev == -1) {
				break;
			} else {
				if(this.data[r][c] == 0) {

					this.data[r][c] = this.data[prev][c];

					this.data[prev][c] = 0;
					r++;
				} else if(this.data[r][c] ==
					this.data[prev][c]) {

					this.data[r][c] *= 2;

					this.data[prev][c] = 0;
					this.score += this.data[r][c];
				}
			}
		}
	},
	getUpPrev: function(r, c) {
		for(var r_ = r - 1; r_ >= 0; r_--) {
			if(this.data[r_][c] != 0) {
				return r_;
			}
		}
		return -1;
	}

}

//页面加载后，启动游戏
//事件
window.onload = function() {
	game.start();
	document.onkeydown = function() {
		if(this.state == this.RUNNING) {
			var e = window.event || arguments[0];
			if(e.keyCode == 37) {
				game.moveLeft();
			} else if(e.keyCode == 39) {
				game.moveRight();
			} else if(e.keyCode == 38) {
				game.moveUp();
			} else if(e.keyCode == 40) {
				game.moveDown();
			}
		}

	}
}