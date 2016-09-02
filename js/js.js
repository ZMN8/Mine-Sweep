/**
 * Created by Administrator on 2016/8/23.
 */
var bigArea=document.getElementById("bigArea");
var liNodes=bigArea.getElementsByTagName("li");
var ulNode=document.getElementsByTagName("ul")[0];
var a=[];//记录是否有雷的数组
var allNode=[];//li结点数组
var landmineNum=10;//一共10颗雷
var winer=0;//计算点开的个数时候符合赢得标准
var WINbool=false;//没有点开雷

function pro(col) {//产生li数组
    var b=[];//记录li节点个数，用于布雷
    var frag=document.createDocumentFragment();
    var row=10;
    for(y=0;y<col;y++){
       a[y]=[];
       allNode[y]=[];
        for(x=0;x<row;x++){
            a[y][x]=true;//false表示有雷，true表示没有雷
            var liNode=document.createElement("li");
            liNode.x=x;//横坐标
            liNode.y=y;//纵坐标
            allNode[y][x]=liNode;
            frag.appendChild(liNode);

        }
    }
    ulNode.appendChild(frag);

    ////////////////////布雷
    for(j=0;j<liNodes.length;j++){//产生0-99的数
        b[j]=j;
    }

    for(i=0;i<landmineNum;i++){
        var iPos=Math.floor(Math.random()* b.length);//产生0-99的随机位置
        var liPos=b[iPos];//找到第iPos个li节点
        a[liNodes[liPos].y][liNodes[liPos].x]=false;//布雷为false
        b.splice(iPos,1);//将这个位置序号删掉
    }
}
/*初始化 布雷*/
pro(10);
/*鼠标左键点击事件*/
ulNode.onclick=function(e){
    var event=window.event || e;
    var target=event.srcElement||event.target;
    var buttton=event.button;//判断鼠标左键或者右键
    if(target.nodeName.toLowerCase()=="li"){//如果点击li节点
        funJud(target);
    }
};

/*鼠标右键点击事件*/
document.oncontextmenu= function (e) {
    var event=window.event || e;
    event.returnValue=false;//取消事件默认行为 event.returnValue=false;
};
ulNode.onmousedown=function(e){
    var event=window.event || e;
    var target=event.srcElement||event.target;
    if(event.button===2){//右键点击
        if(target.nodeName.toLowerCase()=="li"){//如果点击li节点
            funPut(target);
        }
    }
};

function funPut(target) {
    var message=document.querySelector(".message");
    var spanNode=message.querySelector("span");
    var x=target.x;
    var y=target.y;
    if(allNode[y][x].className=="qi"){
        allNode[y][x].className="";
        spanNode.innerHTML=Number(spanNode.innerHTML)+1;
    }else if(spanNode.innerHTML!=0){
        if(allNode[y][x].className==""){
            allNode[y][x].className="qi";
            spanNode.innerHTML-=1;
        }
    }
}

function funJud(target){//如果点击li节点
    if(target.className=="none"){//当前已有样式则退出函数
        return;
    }
    var x=target.x;//li节点的横坐标
    var y=target.y;//li节点的纵坐标
    winer++;
    console.log(winer);


    /*输的关键*/
    if(a[y][x]==false){//当前是雷
        WINbool=true;
        for(y=0;y<10;y++){
            for(x=0;x<10;x++) {
                if (a[y][x] == false) {
                    allNode[y][x].className = "lei";//将所有雷的样式加上
                }
            }
        }
        for(y=0;y<10;y++) {
            for (x = 0; x < 10; x++) {
                if (allNode[y][x].className == "") {//将其他没有点开的li全部点开
                    funJud(allNode[y][x]);
                }
            }
        }

        alert("不好意思，你输了。下次走运！");
        setTimeout(function(){
          window.location.reload();
        },500);
        return;
    }

    var landmine=0;//计算周围的雷个数
    for(var n=y-1;n<=y+1;n++){//依次查询 周围8个li节点和自己
        for(var m=x-1;m<=x+1;m++){
            if( m>=0 && n>=0){
                if(a[n]!=null){//a[n]必须是存在的元素，否则a[n][m]报错
                    if(a[n][m]==false){//a[n][m]必须存在，否则获取不了属性。会报错
                        landmine++;
                    }
                }
            }
        }

    }
    if(landmine==0){
        target.className="none";//周围没有雷，加上样式继续查询
        for(var n=y-1;n<=y+1;n++){//依次查询 周围8个li节点和自己
            for(var m=x-1;m<=x+1;m++){
                if(m>=0 && n>=0) {
                    if (a[n] != null) {
                        if (a[n][m] != null) {
                            if ((m != x || n != y) && (allNode[n][m].className != "none")) {
                                funJud(allNode[n][m]);
                            }
                        }
                    }
                }
            }
        }
    }else{//附近有雷
        target.className="none";//当前li加none样式
        target.innerHTML=landmine;//显示附近雷的个数
    }

    /*判断输赢*/
    if(winer==100-landmineNum && !WINbool){
        alert("恭喜你赢了！");
        setTimeout(function(){
            window.location.reload();
        },500);
    }

}

