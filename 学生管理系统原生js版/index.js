var menu = document.getElementById('menu'); // 获取左侧菜单
var modal = document.getElementById('modal');
var allTableData = [];


// 初始化样式，默认选中学生列表
function init() {
    var active = document.getElementsByClassName('active')[0];
    // 代码重复时，用一个函数来封装
    // var id = active.getAttribute('data-id');
    // var rightContent = document.getElementById(id);
    // rightContent.style.display = 'block';
    initRightContent(active); // 默认学生列表右侧内容显示
    renderData();
    bindEvent();
}

// 绑定事件
function bindEvent() {
    // 菜单点击事件
    menu.onclick = function (e) {
        // console.log(e.target.tagName);
        var tagName = e.target.tagName;
        if(tagName != 'DD') { // 判断，不让标签为DT的元素触发事件
            return false;
        }
        initRightContent(e.target); // 点击后，右侧内容先隐藏，再显示对应的内容
        initMenu();
        e.target.classList.add('active');
    }
    // 编辑事件
    // var editBtn = document.getElementsByClassName('edit');
    // for(var i = 0; i < editBtn.length; i++) {
    //     editBtn[i].onclick = function () {
    //         modal.classList.add('show');
    //         var index = this.getAttribute('data-index');
    //         // allTableData[index]
    //         initEditForm(allTableData[index]);
    //     }
    // }
    var modalContent = document.getElementsByClassName('modal-content')[0];
    modalContent.onclick = function (e) {
        e.stopPropagation();
    }
    modal.onclick = function () {
        modal.classList.remove('show');
    }
    // 编辑学生提交
    var editSubmitBtn = document.getElementById('edit-submit');
    var editForm = document.getElementById('edit-student-form');
    editSubmitBtn.onclick = function (e) {
        e.preventDefault();
        // getFormData(editForm);
        var formResult = getFormData(editForm);
        if (formResult.status == 'fail') {
            alert(formResult.msg);
            return false;
        }
        var obj = Object.assign({
            appkey: 'he19980804__1547825419047'
        }, formResult.student);
        var result = saveData('http://api.duyiedu.com/api/student/updateStudent', obj);
        // console.log(result);
        console.log(result);
        if(result.status == 'success') {
            editForm.reset();
            alert('修改成功');
            modal.classList.remove('show');
            renderData();
        }else {
            alert(result.msg);
        }
    }

    // 新增学生提交
    var addSubmitBtn = document.getElementById('add-student');
    var addForm = document.getElementById('add-student-form');
    addSubmitBtn.onclick = function (e) {
        e.preventDefault();
        // e.stopPropagation();
        var formResult = getFormData(addForm);
        console.log(formResult)
        if (formResult.status === 'fail') {
            // alert(formResult.msg);
            return false;
        }
        var studentData = formResult.student;
        // console.log(studentData);
        var obj = Object.assign({
            appkey: 'he19980804__1547825419047'
        }, studentData);
        var result = saveData('http://api.duyiedu.com/api/student/addStudent', obj);
        console.log(result);
        if(result.status === 'success') {
            alert('添加成功');
            var studentList = document.getElementsByTagName('dd')[0];
            studentList.click();
            renderData();
            addForm.reset();
        } else {
            alert(result.msg);
        }
        // console.log(result);
    }
}

// 初始化左侧导航样式
function initMenu() {
    var active = document.getElementsByClassName('active');
    for(var i = 0; i < active.length; i++) {
        active[i].classList.remove('active');
    }
}

// 初始化右侧导航
function initRightContent(dom) {
    var id = dom.getAttribute('data-id');
    var rightContent = document.getElementById(id);
    var content = document.getElementsByClassName('content');
    for(var i = 0; i < content.length; i++) {
        content[i].style.display = 'none';
    }
    rightContent.style.display = 'block';
}

// 向后端存储数据
function saveData(url, param) {
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
// console.log(saveData('http://api.duyiedu.com/api/student/findAll', 'appkey=he19980804__1547825419047'));

// 渲染表格数据
function renderData() {
    var data = saveData('http://api.duyiedu.com/api/student/findAll', 'appkey=he19980804__1547825419047');
    if(data.status == 'fail') {
        alert(data.msg);
        return false;
    }
    var tableData = data.data;
    allTableData = data.data;
    var tableBody = document.getElementById('student-body');
    var str = '';
    for(var i = 0; i < tableData.length; i++) {
        str += '<tr>\
        <td>' + tableData[i].sNo + '</td>\
        <td>' + tableData[i].name + '</td>\
        <td>' + (tableData[i].sex ? '女' : '男' ) + '</td>\
        <td>' + tableData[i].email + '</td>\
        <td>' + (new Date().getFullYear() - tableData[i].birth) + '</td>\
        <td>' + tableData[i].phone + '</td>\
        <td>' + tableData[i].address + '</td>\
        <td>\
            <button class="btn edit" data-index=' + i + '>编辑</button>\
            <button class="btn del" data-index=' + i + '>删除</button>\
        </td>\
    </tr>'
    }
    tableBody.innerHTML = str;
    bindTableEvent();
}

// 编辑的表单回填 初始化编辑的表单
function initEditForm(data) {
    var editForm = document.getElementById('edit-student-form');
    for(var prop in data) {
        if(editForm[prop]) {
            editForm[prop].value = data[prop];
        }
    }
}

// 获取form表单的学生数据
function getFormData(formData) {
    var status = 'success';
    var msg = '';
    var name = formData.name.value;
    var sex = formData.sex.value;
    var sNo = formData.sNo.value;
    var email = formData.email.value;
    var birth = formData.birth.value;
    var phone = formData.phone.value;
    var address = formData.address.value;
    var student = {
        name: name,
        sex: sex,
        sNo: sNo,
        email: email,
        birth: birth,
        phone: phone,
        address: address,
    }
    return {
        student: student,
        msg: msg,
        status: status
    };
}

function bindTableEvent() {
    var editBtn = document.getElementsByClassName('edit');
    var delBtn = document.getElementsByClassName('del');
    for(var i = 0; i < editBtn.length; i++) {
        editBtn[i].onclick = function () {
            modal.classList.add('show');
            var index = this.getAttribute('data-index');
            // allTableData[index]
            initEditForm(allTableData[index]);
        }
        delBtn[i].onclick = function () {
            var isDel = window.confirm('确认删除？');
            if(!isDel) {
                return false;
            }
            var index = this.getAttribute('data-index');
            var result = saveData('http://api.duyiedu.com/api/student/delBySno', {
                appkey: 'he19980804__1547825419047',
                sNo: allTableData[index].sNo
            })
            // console.log(result);
            if(result.status == 'success') {
                alert('删除成功');
                renderData();
            }
        }
    }
}

init();

