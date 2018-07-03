/**
 * Created by user on 2018/6/3.
 */
window.onload = function () {
    function byClassName(className) {
        return typeof(className) === "string" ? document.getElementsByClassName(className) : className;
    }

    function byId(id) {
        return typeof(id) === "string" ? document.getElementById(id) : id;
    }

    var cartTa = byId("cartTable"),
        tr = cartTa.children[1].rows,
        checkAll = byClassName("check_all"),
        checks = byClassName("check"),
        deleteAl = byId("deleteAll"),
        priceTo = byId("priceTotal"),
        selectedTo = byId("selectedTotal"),
        selecteds = byId("selected"),
        selectedViewLi = byId("selectedViewList"),
        foot = byId("foot");
    // 全选
    for (var i = 0; i < checks.length; i++) {
        checks[i].onclick = function () {
            if (this.className === "check_all check") {
                for (var j = 0; j < checks.length; j++) {
                    checks[j].checked = this.checked;
                }
            }
            if (this.checked == false) {
                for (var k = 0; k < checkAll.length; k++) {
                    checkAll[k].checked = false;
                }
            }
            getTotal();
        }
    }
    // 计算
    function getTotal() {
        var price = 0;
        var selected = 0;
        var htmlStr = "";
        for (var i = 0; i < tr.length; i++) {
            if (tr[i].getElementsByTagName("input")[0].checked) {
                selected += parseInt(tr[i].getElementsByTagName("input")[1].value);
                price += parseFloat(tr[i].cells[4].innerHTML);
                tr[i].style.background = "RGB(244,222,225)";
                htmlStr += "<div><img src='" + tr[i].getElementsByTagName("img")[0].src + "'>" +
                    "<span class='del' index='" + i + "'>取消选择</span></div>"
            } else {
                tr[i].style.background = "#fff";
            }
        }
        selectedTo.innerHTML = selected;
        priceTo.innerHTML = price.toFixed(2);
        selectedViewLi.innerHTML = htmlStr;
        if (selecteds == 0) {
            foot.className = "foot";
        }
    }

    // 已选产品显示或隐藏
    selecteds.onclick = function () {
        if (foot.className == "foot") {
            if (selectedTo.innerHTML != 0) {
                foot.className = "foot show";
            }
        } else if (foot.className == "foot show") {
            foot.className = "foot";
        }
    };
    // 取消选择 事件委托
    selectedViewLi.onclick = function (e) {
        e = e || window.event;
        var el = e.srcElement;
        if (el.className == "del") {
            var index = el.getAttribute("index");
            var input = tr[index].getElementsByTagName("input")[0];
            input.checked = false;
            input.onclick();             //?????????????????????
        }
    };
    //加减数量
    for (var j = 0; j < tr.length; j++) {
        tr[j].onclick = function (e) {
            e = e || window.e;
            var el = e.srcElement;
            var cls = el.className;
            var input = this.getElementsByTagName("input")[1];
            var val = parseInt(input.value);
            var reduce = this.getElementsByTagName("span")[1];
            switch (cls) {
                case "reduce":
                    if (val > 1) {
                        input.value = val - 1;
                    }
                    if (val <= 1) {
                        reduce.innerHTML = "";
                    }
                    getSubTotal(this);
                    break;
                case "add":
                    input.value = val + 1;
                    reduce.innerHTML = "-";
                    getSubTotal(this);
                    break;
                case "delete":
                    var conf = confirm("确定删除吗？");
                    if(conf){
                        this.parentNode.removeChild(this);
                    }
                    break;
                default:break;
            }
            getTotal();
        };
        tr[j].getElementsByTagName("input")[1].onkeyup = function(){
            var tr = this.parentNode.parentNode,
                val = parseInt(this.value),
                reduce = tr.getElementsByTagName("span")[1];
            if(isNaN(val) || val < 1){
                val = 1;
            }
            this.value = val;
            if(val <= 1){
                reduce.innerHTML = "";
            }else{
                reduce.innerHTML = "-";
            }
            getSubTotal(tr);
            getTotal();
        }
    }
    function getSubTotal(tr) {
        var input = tr.getElementsByTagName("input")[1],
            val = parseInt(input.value),
            price = tr.cells[2].innerHTML,
            subTotal = parseFloat(price * val);
            tr.cells[4].innerHTML = subTotal.toFixed(2);
    }
    deleteAl.onclick = function(){
        if(selectedTo.innerHTML != "0"){
            var conf = confirm("确定删除所选项吗？");
            if(conf){
                for(var i = 0;i < tr.length;i ++){
                    var input = tr[i].getElementsByTagName("input")[0];
                    if(input.checked){
                        tr[i].parentNode.removeChild(tr[i]);
                        i --;
                    }
                }
                getTotal();
                for(var j = 0;j < checkAll.length;j ++){
                    checkAll[j].checked = false;
                }
            }
        }
    };
    checkAll[0].checked = true;
    checkAll[0].onclick();
};
