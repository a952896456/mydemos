var menu = document.getElementById('menu');

var studentList = document.getElementById('student-list');

var modal = document.getElementById('modal');

var allTableData = [];
// 
function init() {
    var active = document.getElementsByClassName('active')[0];
    // 初始化右侧内容区页面
    initContentShow(active);
    // 右侧内容区表格渲染
    renderTable();
    // 绑定事件
    bindEvent();
}
// 绑定事件
function bindEvent() {
    // 左侧导航切换
    menu.onclick = function (e) {
        var tagName = e.target.tagName.toLowerCase();
        // 判断点击元素是不是dd  也就是导航
        if (tagName != 'dd') {
           return false;
        }
        // 切换导航修改右侧页面
        initContentShow(e.target);
        // 切换左侧导航样式
        initMenuList();
        e.target.classList.add('active');
    }
    
    // 弹框的交互
    var modalContent = document.getElementsByClassName('modal-content')[0];
    // 弹框内容区点击 不消失 阻止冒泡
    modalContent.onclick = function (e) {
        e.stopPropagation();
    }
    // 点击弹窗以外 关闭弹窗
    modal.onclick = function () {
        modal.classList.remove('show');
    }
    // 编辑学生提交
    var editSubmitBtn = document.getElementById('edit-submit');
    var editForm = document.getElementById('edit-student-form');
    editSubmitBtn.onclick = function (e) {
        // 阻止表单提交刷新的默认事件
        e.preventDefault();
        // 需要传递到后端保存的数据
        var formResult = getFormData(editForm);
        if (formResult.status == 'fail') {
            alert(formResult.msg);
            return false;
        }
        var obj = Object.assign({
            appkey: 'dongmeiqi_1547441744650',
        }, formResult.student);
        // 保存数据
        var result = changeData('http://api.duyiedu.com/api/student/updateStudent', obj);
        // 如果成功保存数据   则弹框消失 充值表单  否则弹出错误信息
        if (result.status == 'success') {
            editForm.reset();
            alert('修改成功');
            modal.classList.remove('show');
            renderTable();
        } else {
            alert(result.msg);
        }
    }


    // 新增学生提交
    var addSubmitBtn = document.getElementById('add-submit');
    var addForm = document.getElementById('add-student-form');
    addSubmitBtn.onclick = function (e) {
        // e.preventDefault();
        // getFormData ===> {student: {}, msg: '', status:""}
        var formResult = getFormData(addForm);
        if (formResult.status === 'fail') {
            alert(formResult.msg);
            return false;
        }
        console.log(formResult)
        var studentData = formResult.student;
        var obj = Object.assign({
            appkey: 'dongmeiqi_1547441744650',
        }, studentData);
        var result = changeData('http://api.duyiedu.com/api/student/addStudent', obj);
        console.log(result);
        if (result.status === 'success') {
            alert('添加成功');
            location.reload();
        } else {
            alert(result.msg);
        }
    }
}

// 初始化左侧导航样式
function initMenuList() {
    var active = document.getElementsByClassName('active');
    for (var i = 0; i < active.length; i++) {
        active[i].classList.remove('active');
    }
}
// 初始化右侧内容区样式   让左侧选中的导航对应的内容区展示  其他的内容隐藏
// 参数 dom 代表的是左侧导航元素
function initContentShow(dom) {
    // 左侧选中导航元素对应的右侧内容的id值
    var id = dom.getAttribute('data-id');
    // 获取到右侧要展示的内容元素
    var rightContent = document.getElementById(id);
    // 将右侧所有内容元素置为隐藏状态
    var content = document.getElementsByClassName('content');
    for (var i = 0; i < content.length; i++) {
        content[i].style.display = 'none';
    }
    // 让右侧该展示的元素展示
    rightContent.style.display = 'block';
}


// 向后端存储数据
function changeData(url, param) {
    var result = null;
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    if (typeof param == 'string') {
        xhr.open('GET', url + '?' + param, false);
    } else if (typeof param == 'object'){
        var str = "";
        for (var prop in param) {
            str += prop + '=' + param[prop] + '&';
        }
        xhr.open('GET', url + '?' + str, false);
    } else {
        xhr.open('GET', url + '?' + param.toString(), false);
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                result = JSON.parse(xhr.responseText);
            }
        }
    }
    xhr.send();
    return result;
}

// 渲染表格数据
function renderTable () {
    // 获取数据
    var data = changeData('http://api.duyiedu.com/api/student/findAll', "appkey=dongmeiqi_1547441744650");
    if (data.status == 'fail') {
        alert(data.msg);
        return false;
    }
    // 成功返回  渲染表格数据
    var tableData = data.data;
    allTableData = data.data;
    var tableBody = document.getElementById('student-body');
    var str = '';
    for (var i = 0; i < tableData.length; i++) {
        str += '<tr>\
        <td>' + tableData[i].sNo +'</td>\
        <td> ' + tableData[i].name +' </td>\
        <td>' + (tableData[i].sex ? '女' : '男' )+'</td>\
        <td> ' + tableData[i].email +'</td>\
        <td>' + (new Date().getFullYear() - tableData[i].birth) +'</td>\
        <td> ' + tableData[i].phone +'</td>\
        <td>' + tableData[i].address +'</td>\
        <td>\
            <button class="btn edit" data-index=' + i +'>编辑</button>\
            <button class="btn del" data-index=' + i +'>删除</button>\
        </td>\
    </tr>';
    }
    tableBody.innerHTML = str;
    bindTableEvent();
}
// 初始化编辑的表单  （回填数据）
function initEditForm(data) {
    // 获取到编辑的form元素
    var editForm = document.getElementById('edit-student-form');

    for (var prop in data) {
        // 判断 form表单里面是否存在name=prop的input标签 若有 回填数据
        if (editForm[prop]) {
            editForm[prop].value = data[prop];
        }
    }

    
    
}
// 获取form表单的学生数据
function getFormData(form) {
    console.log(this);
    var status = 'success';
    var msg = '';
    var name = form.name.value;
    var sex = form.sex.value;
    var sNo = form.sNo.value;
    var email = form.email.value;
    var birth = form.birth.value;
    var phone = form.phone.value;
    var address = form.address.value;
    var student = {
        name: name,
        sex: sex,
        sNo: sNo,
        email: email,
        birth: birth,
        phone: phone,
        address: address,
    }
    console.log(name.match(/^.{4,16}$/))
    if (!name.match(/^.{4,16}$/)) {
        msg = '姓名为4到16位字符';
        status = 'fail';
    }

    return {
        student: student,
        msg: msg,
        status: status
    };
}

function bindTableEvent() {
  // 为编辑按钮添加事件
  var editBtn = document.getElementsByClassName('edit');
  var delBtn = document.getElementsByClassName('del');
  for (var i = 0; i < editBtn.length; i++) {
        // 编辑点击事件应该放在表格数据添加到页面之后？
        editBtn[i].onclick = function () {
            // 点击编辑按钮 展示弹框
            modal.classList.add('show');
            // 编辑弹框数据回填
            var index = this.getAttribute('data-index');
            // allTableData[index]
            initEditForm(allTableData[index]);
        }
        delBtn[i].onclick = function () {
            var isDel = window.confirm('确认删除？');
            if (!isDel) {
                return false;
            }
            var index = this.getAttribute('data-index');
            var result = changeData('http://api.duyiedu.com/api/student/delBySno', {
                appkey: 'dongmeiqi_1547441744650',
                sNo: allTableData[index].sNo,
            });
            // console.log(result);
            if (result.status === 'success') {
                alert('删除成功');
                renderTable();
            }
        }

  }
}

init();

function validate (target) {
    if (!target.value) {
        alert(target.name + '不能为空');
    }
}
