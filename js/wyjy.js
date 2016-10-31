//获取id
function $(id){
	return document.getElementById(id);
}

//设置cookie
function setcookie(name,value,time){
	var cookie = name + '=' + value;
	if(time){
		var d = new Date();
		d.setDate(d.getDate() + time);
		cookie += ';expires=' + d.toGMTString(); 
	}
	document.cookie = cookie;
}
//获取cookie
function getcookie(name){
    var list = document.cookie.split('; ');
    for (var i = 0;i < list.length;i++){
        var item = list[i].split('=');
        if(item[0] === name){
            return decodeURI(item[1]);
        }
    }
}
//删除cookie
function removecookie(name){
	setcookie(name,'',-1);	
}

//请求参数序列画
function serialize(data){
    if(!data) return '';
    var pairs = [];
    for(var name in data){
        if(!data.hasOwnProperty(name)) continue;
        if(typeof data[name] === 'function') continue;
        var value = data[name].toString();
        name = encodeURIComponent(name);
        value = encodeURIComponent(value);
        pairs.push(name + '=' + value);
    }
    return pairs.join('&');
}

//get请求
function get(url,formdata,callback){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function (){
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                 callback(xhr.responseText);
            } else {
                alert('request failed : ' + xhr.status);
            }
        }
    };
    xhr.open('get',url + '?' + serialize(formdata),true);
    xhr.send(null);
}

//getElementsByClassName兼容
function getElementsByClassName(element,names){   
	if (element.getElementsByClassName){
		return element.getElementsByClassName(names);
	}else{
		var elements = element.getElementsByTagName('*');
		var result = [];
		var element,
			classNameStr,
			flag;
		names = names.split(' ');
		for(var i = 0; element = elements[i]; i++){
			classNameStr = ' ' + element.className + ' ';
			flag = true;
			for(var j = 0, name; name = names[j]; j++){
				if(classNameStr.indexOf(' ' + name + '') == -1){
					flag = false;
					break;
				}
			}
			if(flag){
				result.push(element);
			}
		}
		return result;
	}
}


//顶部通知条控制
var t = $('dbtzt');
//检测通知条状态
function jcTZT(){
	if(getcookie('tztclose')){
		t.style.display = 'none';
	}else{
		t.style.display = 'block';
	}
}
jcTZT();
//关闭通知条
function closeTZT() {
    t.style.display = 'none';
	//设置cookie，有效期1年
    setcookie('tztclose','1',365);
}


//关注“网易教育产品部”/登录
var tGZ = $('djgz');
var YGZ = $('ygz')
var tDLCK = $('dlck');
var FSS = $('fs');
var tClose = getElementsByClassName(tDLCK,'closedlck');
var tInput = tDLCK.getElementsByTagName('input');
var tLabel = tDLCK.getElementsByTagName('label');
var tButton = getElementsByClassName(tDLCK,'submit');
var tCancel = getElementsByClassName(tDLCK,'qx');
//检查登录关注状态
function JCGZ(){
	if(getcookie('loginSuc') && getcookie('followSuc')){
		tGZ.style.display = 'none';
		YGZ.style.display = 'block';
		FSS.innerHTML = '粉丝 46';
	}else{
		tGZ.style.display = 'block';
		YGZ.style.display = 'none';
		FSS.innerHTML = '粉丝 45';		
	}
}JCGZ();

//关注过程
function GZ(){	
	//通过cookie判断是否登录
	if(!getcookie('loginSuc')){
		tDLCK.style.display = 'block';
		fadeIn(tDLCK,100);
	}else{
		GZYZ();	
	}
	//登录框输入时隐藏提示文字
	function focus(i){
		tInput[i].onfocus = function(){tLabel[i].style.display = 'none';};
		tInput[i].onblur = function(){
			if(this.value ===''){
				tLabel[i].style.display = 'block';
			}
		};
	}
	focus(0);
	focus(1);
	//登录
	tButton[0].onclick = function(){
		var username1 = hex_md5(tInput[0].value);
		var password1 = hex_md5(tInput[1].value);
		get('https://study.163.com/webDev/login.htm',{userName:username1,password:password1},function(a){ 
			if( a === '1' ){
				tDLCK.style.display = 'none';
				setcookie('loginSuc','1');
				GZYZ();
			}else{
				alert('你输入的密码和账号不匹配，请重新输入');
			}
		});
	}

	//关注验证
	function GZYZ(){
		get('https://study.163.com/webDev/attention.htm','', function(b){
			if( b === '1' ){
				setcookie('followSuc','1',365);
				tGZ.style.display = 'none';
				YGZ.style.display = 'block';
				FSS.innerHTML = '粉丝 46';
			}
		});
	}
	//关闭登录框
	tClose[0].onclick = function(){
		tDLCK.style.display = 'none';
	}
}
//取消关注
function QXGZ(){
		removecookie('followSuc');
		tGZ.style.display = 'block';
		YGZ.style.display = 'none';
		FSS.innerHTML = '粉丝 45';
}


//轮播图
window.onload = function(){ 
	var flag = 1; 
	var img = $('slider').getElementsByTagName('img'); 
	var poin = $('pointer').getElementsByTagName('i'); 
	//默认被选中颜色 
	poin[0].style.backgroundColor = '#333';

	time = setInterval(turn, 5000); 
	img.onmouseover = function () { 
		clearInterval(time); 
	} 
	img.onmouseout = function () { 
		time = setInterval(turn, 5000); 
	} 
	  
	for (var num = 0; num < poin.length; num++) { 
		!function(k){
			poin[k].onclick = function(){					
				clearInterval(time);
				flag = k;turn();flag = k+1;
				time = setInterval(turn,5000);
			}
					
		}(num)
	} 

	function turn(){
			if(flag<img.length-1){
				autoslide(flag);
				flag++;
			}else{
				autoslide(flag);
				flag = 0;
			}
		}

	function autoslide(t){
		for(var i = 0;i<poin.length;i++){
			poin[i].style.backgroundColor = '#fff';
		}
		poin[t].style.backgroundColor = '#333';
		if(t == 0){
			img[0].style.zIndex = t;
			img[1].style.zIndex = t;
			img[2].style.zIndex = t;
			fadeIn(img[2],500);
		}else if(t == 1){
			img[t-1].style.zIndex = 0;
			img[t].style.zIndex = t;
			img[t+1].style.zIndex = 0;
			fadeIn(img[1],500);
		}else if(t == 2){
			img[0].style.zIndex = t;
			fadeIn(img[0],500);
		}
	}

} 



function fadeIn(obj,time){//淡入函数  实现time毫秒后显示，原理是根据透明度来完成的
	var startTime = new Date(); 
	obj.style.opacity = 0;//设置下初始值透明度
	obj.style.display= 'block';
	var timer = setInterval(function(){
		var nowTime = new Date();
		var prop = (nowTime-startTime)/time;
		if(prop >= 1){
			prop = 1;//设置最终系数值
			clearInterval(timer);
		}
		obj.style.opacity = prop;//透明度公式： 初始值+系数*（结束值-初始值）
	},10);//每隔10ms执行一次function函数
};


//产品设计编程语言
var KCLB = $('kclb');
var CPSJ = KCLB.getElementsByTagName('input');
CPSJ[0].onclick = function(){
	CPSJ[0].setAttribute('class','selected');
	CPSJ[1].className = CPSJ[1].className.replace('selected',' ');
	ZCNR(10);
}
CPSJ[1].onclick = function(){
	CPSJ[1].setAttribute('class','selected');
	CPSJ[0].className = CPSJ[0].className.replace('selected',' ');
	ZCNR(20);
}


//获取课程卡片数据
function ZCNR(num){
	get('https://study.163.com/webDev/couresByCategory.htm',{pageNo:1,psize:20,type:num},function(data){
		var data = JSON.parse(data);
		var tLB = $('LB');
		var tLi = tLB.getElementsByTagName('li');		
		var tImg = getElementsByClassName(KCLB,'mlimg');
		var tMlp = getElementsByClassName(KCLB,'mlp');
		var tMlly = getElementsByClassName(KCLB,'mlly');
		var tMlrs = getElementsByClassName(KCLB,'mlrs');
		var tMljg = getElementsByClassName(KCLB,'mljg');
		var tMlrzx = getElementsByClassName(KCLB,'mlrzx');
		var tMlfbz = getElementsByClassName(KCLB,'mlfbz');
		var tMltype = getElementsByClassName(KCLB,'mltype');
		var tMlms = getElementsByClassName(KCLB,'mlms');
		for(var i = 0;i < data.list.length;i++){
			tImg[i].src = data.list[i].middlePhotoUrl;
			tMlp[i].innerHTML = data.list[i].name;
			tMlp[i].setAttribute('title',data.list[i].name);
			tMlly[i].innerHTML = data.list[i].provider;
			tMlrs[i].innerHTML = data.list[i].learnerCount;
			if(data.list[i].price == 0){
				tMljg[i].innerHTML = '免费';
			}else{
				tMljg[i].innerHTML = '￥' + data.list[i].price;	
			}
			tMlrzx[i].innerHTML = data.list[i].learnerCount;
			tMlfbz[i].innerHTML = data.list[i].provider;
			if(data.list[i].categoryName == null){
				tMltype[i].innerHTML = '无';
			}else{
				tMltype[i].innerHTML = data.list[i].categoryName;
			}
			tMlms[i].innerHTML = data.list[i].description.replace('　',''); //去掉产品设计第一页第一个产品“　本期极客活动...”前的一个大空格
			tMlms[i].setAttribute('title',data.list[i].description);
		}
	});
}ZCNR(10);


//点击弹出视频窗口
function videoshow(){
	var tSide = $('sd');
	var tVshow = getElementsByClassName(tSide,'vshow');
	var tIvideo = getElementsByClassName(tSide,'ivideo');
	var tCV = getElementsByClassName(tSide,'closevideo');
	var tVd = tSide.getElementsByTagName('video');
	tVshow[0].onclick = function(){
		tIvideo[0].style.display = 'block';
		tVd[0].src = 'https://mov.bn.netease.com/open-movie/nos/mp4/2014/12/30/SADQ86F5S_shd.mp4';
	};
	tCV[0].onclick = function(){
		tIvideo[0].style.display = 'none';
		tVd[0].src = '';
	}
}videoshow();


//最热排行
function ZRPH(){
	get('https://study.163.com/webDev/hotcouresByCategory.htm','',function(data){
		var data = JSON.parse(data);
		var tHL = $('HL');
		var tHLli = tHL.getElementsByTagName('li');
		var tHLimg = tHL.getElementsByTagName('img');
		var tHLha = tHL.getElementsByTagName('a');
		var tHLsp = tHL.getElementsByTagName('span');
		for(var j = 0;j < data.length;j++){
			tHLimg[j].src = data[j].smallPhotoUrl;
			tHLha[j].innerHTML = data[j].name;
			tHLha[j].setAttribute('title',data[j].name);
			tHLsp[j].innerHTML = data[j].learnerCount;
		};
		for(var k = 0;k < 10;k++){
			var node=document.createElement("LI");
			tHL.appendChild(node);
			tHLli[k+20].innerHTML = tHLli[k].innerHTML;
		}
		//设定5秒滚动
		var HLa = 0;
		var HLLB = setInterval(autoplay,5000);
		function autoplay(){
			if(HLa < 19){
				tHLli[HLa].style.display = 'none';
				HLa++;
			}else{	
				for(var k = 0;k<20;k++){
					tHLli[k].style.display = 'block';
				}					
				HLa = 0;
			}
		}
		//鼠标悬停时暂停
		tHL.onmouseover = function(){clearInterval(HLLB);};
		tHL.onmouseout = function(){HLLB = setInterval(autoplay,5000);}
	});
}ZRPH();










