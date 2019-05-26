
var pageSize = 10;
var nowPage = 1;
var tableData = [];
var searchWord = "";
// 绑定事件
function bindEvent() {
    // 菜单切点击切换
    $('#menu').on('click', 'dd', function (e) {
        // console.log(this);
        $('#menu > dd.active').removeClass('active');
        $(this).addClass('active');
        var id = $(this).attr('data-id');
        if(id == 'student-list') {
            getTableData(nowPage);
            $('#add-student-form')[0].reset();
        }
        $('.content').fadeOut();
        $('#' + id).fadeIn();
    });
    // 编辑学生点击事件
    $('#edit-submit').click(function (e) {
        e.preventDefault();
        var data = $('#edit-student-form').serialize();
        transferData('/api/student/updateStudent', data, function () {
            alert('修改成功');
            $('#modal').slideUp();
            $('#menu > dd[data-id=student-list]').trigger('click');
        })
    });
    // 新增学生点击事件
    $('#add-submit').click(function (e) {
        e.preventDefault();
        var data = $('#add-student-form').serialize();
        transferData('/api/student/addStudent', data, function() {
            alert('提交成功');
            $('#add-student-form')[0].reset();
            $('#menu > dd[data-id=student-list]').trigger('click');
        });
    });
    // 搜索过滤功能
    $('#search-submit').click(function (e) {
        var value = $('#search-word').val();
        nowPage = 1;
        if(!value) {
            getTableData(nowPage);
            return false;
        }
        searchWord = value;
        // 有内容则 让其获取searchStudent借口数据
        getSearchTableData();
    })
}

// 绑定表单事件
function bindTableEvent() {
    // 编辑按钮点击事件
    $('.edit').click(function (e) {
        var index = $(this).data('index');
        // console.log(index);
        $('#modal').slideDown();
        initEditForm(tableData[index]);
    });
    // 阻止冒泡
    $('.modal-content').click(function (e) {
        e.stopPropagation();
    });
    $('#modal').click(function (e) {
        $('#modal').slideUp();
    });
    $('.del').click(function (e) {
        var index = $(this).data('index');
        var isDel = window.confirm('确认删除？');
        var sNo = tableData[index].sNo;
        if(isDel) {
            transferData('/api/student/delBySno', {
                sNo: sNo
            }, function (res) {
                alert('删除成功');
                $('#menu > dd[data-id=student-list]').trigger('click');
            })
        }
    })
}

// 获取表格数据
function getTableData(page) {
    // 搜索前的表格数据
    transferData('/api/student/findByPage', {
        page: page,
        size: pageSize,
    }, function (res) {
        // console.log(res);
        allPage = Math.ceil( res.data.cont / pageSize );
        $('#turn-page').turnPage({
            allPage: allPage,
            curPage: page,
            changePage: function (page) {
                nowPage = page;
                getTableData(page);
            }
        })
        renderTable(res.data.findByPage);
    })
}

function getSearchTableData() {
    // 获取搜索后的表格数据
    transferData('/api/student/searchStudent', {
        sex: -1,
        search: searchWord,
        page: nowPage,
        size: pageSize,
    }, function (res) {
        // console.log(res);
        // 总页数
        var allPage = Math.ceil( res.data.cont / pageSize );
        // 翻页插件
        $('#turn-page').turnPage({
            curPage: nowPage,
            allPage: allPage,
            // 改变页码时触发函数 重新获取搜索后的表格数据
            changePage: function (page) {
                nowPage = page;
                getSearchTableData();
            }
        });
        // 渲染数据
        renderTable(res.data.searchList);
    })
}

// 数据回填
function initEditForm(data) {
    // 获取到编辑的form元素
    var editForm = $('#edit-student-form')[0];
    for(var prop in data) {
        // 判断form表单里面是否存在name=prop的input标签 若有 数据回填
        if(editForm[prop]) {
            editForm[prop].value = data[prop];
        }
    }
}

// 初始化
function init() {
    bindEvent();
    $('#menu > dd').eq(0).trigger('click');
}

init();

// ajax获取后端数据
// function getTableData() {
//     // $.ajax({
//     //     type: 'GET',
//     //     url: 'http://api.duyiedu.com/api/student/findAll',
//     //     data: {
//     //         appkey: 'he19980804__1547825419047',
//     //     },
//     //     dataType: 'json',
//     //     success: function (res) {
//     //         // console.log(res);
//     //         if(res.status == 'success') {
//     //             renderTable(res.data);
//     //         }
//     //     },     
//     // })
// }

// 渲染表单
function renderTable(data) {
    tableData = data;
    var str = '';
    data.forEach(function (item, index) {
        str += '<tr>\
            <td>' + item.sNo + '</td>\
            <td> ' + item.name + ' </td>\
            <td>' + (item.sex ? '女' : '男') + '</td>\
            <td> ' + item.email + '</td>\
            <td>' + ( new Date().getFullYear() - item.birth) +'</td>\
            <td> ' + item.phone + '</td>\
            <td> ' + item.address + '</td>\
            <td>\
                <button class="btn edit" data-index=' + index + '>编辑</button>\
                <button class="btn del" data-index=' + index + '>删除</button>\
            </td>\
        </tr>';
    });
    $('#student-body').html(str);
    bindTableEvent();
}

// getTableData();

// function submitFormData(data) {
//     // data += '&appkey=he19980804__1547825419047';
//     // $.ajax({
//     //     type: 'GET',
//     //     url: 'http://api.duyiedu.com/api/student/updateStudent',
//     //     data: data,
//     //     dataType: 'json',
//     //     success: function (res) {
//     //         // console.log(res);
//     //         if(res.status == 'success') {
//     //             alert('修改成功');
//     //             $('#modal').slideUp();
//     //         } else {
//     //             alert(res.msg);
//     //         }
//     //     }
//     // })
// }

// 不一样的作为参数传递 相同的代码封装到函数里面
function transferData(api, data, callback) {
    if ($.type(data) == 'string') {
        data += '&appkey=he19980804__1547825419047';
    } else {
        data = $.extend(data, {
            appkey: 'he19980804__1547825419047'
        });
    }
    $.ajax({
        type: 'GET',
        url: 'http://api.duyiedu.com' + api,
        data: data,
        dataType: 'json',
        success: function (res) {
            if(res.status == 'success') {
                callback(res);
            }else {
                alert(res.msg);
            }
        }
    });
}