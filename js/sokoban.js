/**
 * [原创]jQuery推箱子小游戏（100关且可扩展）,休闲,对战,娱乐,小游戏,下载即用,兼容iPad移动端,代码注释全（附源码）
 *
 * 为了更方便大家学习探讨，未曾压缩。原创不易，请勿商用~
 * 
 * Github仓库：https://github.com/lvbee/Sokoban
 * Gitee 仓库：https://gitee.com/lvbee/Sokoban
 * 在线预览：https://www.jq22.com/jquery-info24487
 */
function Sokoban(elem, btn, controll) {
	// 先把自己用变量储存起来,后面要用
	var myself = this;

	if (!window.$)
		throw new Error('need jquery.js');

	var $elem = $(elem), $startBtn = $(btn), $controll;
	var $sokoban = $elem.find('[data-sokoban]');
	$sokoban.addClass('layui-row box');
	var isStop = true;
	var x = 16, y = 14; //
	var boxStateMap = {};// 原点状态<ROW:true>
	// 0空或走廊；1墙壁；2原点；3箱子；5人物；
	// window.SokobanLevel
	/**
	 * TODO 关卡集合[role]
	 * 
	 * @see 如果要踩原点，就把role1*10+role2变成两位数，支持箱子已归位的情况！
	 */
	var levelList = [
			[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
					1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 3, 0, 3, 2, 1,
					0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 3, 5, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, ],
			[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 5, 0,
					0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 3, 3, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 3, 0, 1, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 2,
					1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0,
					0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, ],
			[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
					1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 3, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 5, 0, 3, 0, 0, 3, 0,
					1, 0, 0, 0, 0, 0, 0, 1, 0, 2, 2, 1, 0, 3, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, ],
			[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
					1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 5, 3, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3, 0, 1, 1, 0,
					0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 3, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 23, 2, 1, 0, 0, 0, 0, 0, 0,
					0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, ],
			[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
					1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 5, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 3, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1,
					0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 3, 0, 1, 0, 0, 0, 0, 0,
					0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, ] ], level = 0;
	var time = 0, step = 0, timeInterval;

	if (window.SokobanLevel)
		levelList = SokobanLevel;
	// Array.prototype.push.apply(levelList, SokobanLevel);
	// http://v.4399pk.com/xiaoyouxi/video_30409.htm

	// 1.先默认显示1-8类数字，以示规则：
	myself.init = function() {
		$sokoban.html('');

		var list = levelList[0];
		for (var i = 0; i < x * y; i++) {
			var role = list[i];
			$sokoban.append('<div class="layui-col-xs1 box-item"><div data-role="' + role + '" data-row="' + i + '" class="layui-icon"></div></div>');
		}

		// 显示要+1
		level = 0;
		console.log('共有多少关卡：', levelList.length);

		// 由HTML提供，这里不做追加HTML，即不支持传true
		// v2为了兼容样式布局，传true表示在容器内，随意布局~
		if (controll != false) {
			$controll = controll == true ? $elem : $(controll);
			if (!$controll || $controll.length < 1)
				$controll = false;
		}

		reset();

		$startBtn.text('开始游戏');
	}

	function reset() {
		if ($controll) {
			if (timeInterval)
				window.clearInterval(timeInterval);
		}
		time = 0;
		step = 0;
		showControllText();
	}

	function showControllText() {
		if (!$controll)
			return;
		$controll.find('.kk_level>span').text((level + 1) + ' / ' + levelList.length);
		$controll.find('.kk_time>span').text(time);
		$controll.find('.kk_step>span').text(step);
	}

	// 2.重新、开始
	myself.restart = function() {
		// 1.重置
		level--;
		// 2.开启
		myself.next();
		// 3.添加事件：
		addEventListener();
	}

	// 3.next
	myself.next = function() {
		if (level + 1 >= levelList.length)
			return;
		level++;
		reset();

		// 3-1.重置元素（这里不是清除后再追加，而是直接修改，故注意class这类特殊处理，然后事件放在restart方法里）
		// $sokoban.find('.people2origin').removeClass('people2origin');
		// $sokoban.find('.box2origin').removeClass('box2origin');
		var list = levelList[level], map = {};
		for (var i = 0; i < x * y; i++) {
			var role = list[i] || 0, className = 'layui-icon';
			if (role == 2)
				map[i] = false;// 注册一下原点
			if (role > 10) {
				var role1 = parseInt(chuyu(role, 10));
				var role2 = parseInt(role % 10);
				// 0空或走廊；1墙壁；2原点；3箱子；5人物；
				if (role1 == 0 || role2 == 0 || role1 == 1 || role2 == 1)
					return myself.next(); // 墙壁或空不能重叠
				if ((role1 == 2 && role2 == 3) || (role1 == 3 && role2 == 2)) {
					map[i] = true;// 箱子踩原点了
					className += ' box2origin';
					role = 3;// 显示箱子
				}
				if ((role1 == 2 && role2 == 5) || (role1 == 5 && role2 == 2)) {
					map[i] = true;// 人物踩原点了
					className += ' people2origin';
					role = 5;// 显示人物
				}
				if ((role1 == 3 && role2 == 5) || (role1 == 5 && role2 == 3))
					return myself.next();// 人物不允许踩箱子
			}
			$sokoban.find('[data-role]:eq(' + i + ')').attr('data-role', role).attr('class', className);
		}

		// 3-2.将原点2保存起来，用于判断：
		boxStateMap = map; // 清空和赋值
		console.log(boxStateMap);

		if ($controll) {
			timeInterval = setInterval(function() {
				if (time < 1000 * 100)
					$controll.find('.kk_time>span').text(++time);
			}, 1000);
		}

		//
		isStop = false;
		$startBtn.text('重玩本关');
	}

	myself.jump = function(jumpLevel) {
		if (isNaN(jumpLevel) || jumpLevel < 1 || jumpLevel > levelList.length)
			return msg('跳选的关卡有误！');
		level = parseInt(jumpLevel) - 2;
		myself.next();
	}

	myself.prev = function() {
		if (level < 1)
			return;
		level -= 2;
		myself.next();
	}

	function addEventListener() {
		if (isStop)
			return;
		console.log('监听器已开启......');

		// @-监听按键：
		$(window).keydown(function(event) {
			event = event || window.event;
			var code = (event.keyCode ? event.keyCode : event.which);
			if (code < 37 || code > 40)
				return true;
			keydownExecute(code); // 37,38,39,40
			event.returnValue = false;
			event.keyCode = 505;
			code = event.preventDefault ? event.preventDefault() : false;
			code = event.stopPropagation ? event.stopPropagation() : false;
			return false;
		});

		// @-监听点击：
		$sokoban.find('[data-role]').click(function() {
			var $space = $(this), role = $space.attr('data-role');
			if (role == 1 || role == 3 || role == 5)
				return console.log('role', role);// 点击墙壁或箱子或人物，不操作
			// 原点或走廊或空
			var sRow = parseInt($space.attr('data-row'));
			// 找到人物
			var $people = $sokoban.find('[data-role="5"]');
			var pRow = parseInt($people.attr('data-row'));
			// 判断可行（粗略判断方向，严格判断看KeyDown）
			var code = 0;
			if (sRow + 1 == pRow) {// 左
				code = 37;
			} else if (sRow - 1 == pRow) {// 右
				code = 39;
			} else if (sRow % x == pRow % x) {
				var ssRow = parseInt(chuyu(sRow, x));
				var ppRow = parseInt(chuyu(pRow, x));
				if (ssRow + 1 == ppRow) {// 上
					code = 38;
				} else if (ssRow - 1 == ppRow) {// 下
					code = 40;
				}
				console.log(ssRow, ppRow, code);
			}
			if (code)// 四周邻居
				return keydownExecute(code);

			// 跳一个格子：
			var $center = null;
			if (sRow + 2 == pRow) {// 左
				code = 37;
				$center = $sokoban.find('[data-row="' + (sRow + 1) + '"]');
			} else if (sRow - 2 == pRow) {// 右
				code = 39;
				$center = $sokoban.find('[data-row="' + (sRow - 1) + '"]');
			} else if (sRow % x == pRow % x) {
				var ssRow = parseInt(chuyu(sRow, x));
				var ppRow = parseInt(chuyu(pRow, x));
				if (ssRow + 2 == ppRow) {// 上
					code = 38;
					$center = $sokoban.find('[data-row="' + ((ssRow + 1) * x + sRow % x) + '"]');
				} else if (ssRow - 2 == ppRow) {// 下
					code = 40;
					$center = $sokoban.find('[data-row="' + ((ssRow - 1) * x + sRow % x) + '"]');
				}
			}
			if (!code)
				return console.log('code:', code);
			if (!$center || $center.length < 1 || $center.attr('data-role') != 3)
				return console.log('$center:', code);
			return keydownExecute(code);
		});
	}

	// 箱子离开的地方一定是走廊；人离开的地方可能是箱子原点或走廊
	// 0空或走廊；1墙壁；2原点；3箱子；5人物；
	function keydownExecute(code) {
		var $people = $sokoban.find('[data-role="5"]');
		var pRow = parseInt($people.attr('data-row'));
		// 由拆开来的左右上下，因为逻辑一样，写成共用的：
		var nextAdd = null;
		// 左：
		if (code == 37) {
			if ((pRow - 2) % x == x - 1)
				return;// 没路走了...
			nextAdd = -1;
		}
		// 右：
		if (code == 39) {
			if ((pRow + 2) % x == 0)
				return;// 没路走了...
			nextAdd = 1;
		}
		// 上：
		if (code == 38) {
			if (chuyu(pRow + 1, x) < 2)
				return console.log('走不了...');
			nextAdd = -x;
		}
		// 下：
		if (code == 40) {
			if (chuyu(pRow + 1, x) > y - 2)
				return console.log('走不了...');
			nextAdd = x;
		}
		if (!nextAdd)
			return;
		var $next = $sokoban.find('[data-row="' + (pRow + nextAdd) + '"]');
		if ($next.attr('data-role') == 1)
			return;// 撞到南墙了...
		if ($next.attr('data-role') == 0)
			return goit($people, $next, pRow); // 走廊
		if ($next.attr('data-role') == 2)
			return goit($people, $next, pRow, true); // 人物踩了原点
		if ($next.attr('data-role') != 3)
			return;// 超出异常
		// 到这$left一定是3箱子
		// 旁边一定是走廊或原点，否则不能动：
		var $doubleNext = $sokoban.find('[data-row="' + (pRow + nextAdd + nextAdd) + '"]');
		if ($doubleNext.attr('data-role') != 0 && $doubleNext.attr('data-role') != 2)
			return; // 推不动
		// 推：
		return pushBox($people, $next, $doubleNext, pRow);
	}

	function pushBox($people, $box, $space, pRow) {
		var pRole = boxStateMap.hasOwnProperty(pRow) ? 2 : 0;
		$people.attr('data-role', pRole);
		$box.attr('data-role', 5); // 箱子变人
		$space.attr('data-role', 3);// 空地变箱子
		$sokoban.find('.people2origin').removeClass('people2origin');
		// 2.人物踩了原点
		var bRow = parseInt($box.attr('data-row'));
		if (boxStateMap.hasOwnProperty(bRow)) {
			$box.addClass('people2origin');
			// 也就是箱子推离了原点
			$box.removeClass('box2origin');
		}
		// 3.推动了一个正确位置：
		var sRow = parseInt($space.attr('data-row'));
		if (boxStateMap.hasOwnProperty(sRow))
			$space.addClass('box2origin');
		// 4.推动后要校验over
		checkIsGameNext();
		// 5.显示步数：
		if ($controll && step < 1000) {
			$controll.find('.kk_step>span').text(++step);
		}
	}

	function goit($people, $next, pRow, bln) {
		if (boxStateMap.hasOwnProperty(pRow)) {// 还原-原点
			$people.attr('data-role', 2); // 变原点
		} else {
			$people.attr('data-role', 0); // 变走廊
		}
		$next.attr('data-role', 5); // 变人
		// 2.人物踩了原点
		$sokoban.find('.people2origin').removeClass('people2origin');
		if (bln)
			$next.addClass('people2origin');
		// 移动人物不校验over
		console.log('走...');
		// 5.显示步数：
		if ($controll && step < 1000) {
			$controll.find('.kk_step>span').text(++step);
		}
	}

	function checkIsGameNext() {
		var temp = true;
		$.each(boxStateMap, function(row, bln) {
			var $me = $sokoban.find('[data-row="' + row + '"]');
			// 原点被其它占用了，不结束！
			if (!$me || $me.attr('data-role') != 3)
				temp = false;
		});
		isOver = temp;
		if (!isOver)
			return;
		if (levelList.length == level + 1) {
			msg('恭喜您，已通过所有关卡！', true);
			return myself.restart();
		}
		msg('恭喜过关，下一关！');
		myself.next();
	}

	function msg(msg, isAlert) {
		if (window.layer)
			return isAlert ? layer.alert(msg) : layer.msg(msg);
		return alert(msg);
	}
	myself.msg = msg;

	function chuyu(m, n) {
		return n == 0 ? 0 : m / n;
	}

	return myself.init();
}