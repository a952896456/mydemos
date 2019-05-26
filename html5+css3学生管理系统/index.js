// 数据信息  结构渲染的交互
(function () {
    var obj = {
        init: function () {
            this.bindEvent();
            this.dataList = [];
            this.studentForm = $('#student-form');
        },
        // 绑定事件
        bindEvent:function () {
            var self = this;
            $('.student-list').on('click', function () {
                self.getAllData();
            });
            // 新增按钮
            $('#submit-add').on('click', function () {
                var data = self.getFormData(self.studentForm);
                self.saveData('http://api.duyiedu.com/api/student/addStudent?appkey=he19980804__1547825419047', data);
            })
        },
        // 获取数据
        getAllData: function () {
            var self = this;
            $.ajax({
                url: 'http://api.duyiedu.com/api/student/findAll?appkey=he19980804__1547825419047',
                success: function (data) {
                    var data = JSON.parse(data);
                    self.dataList = data; // 把数据存到对象上
                    // console.log(data);
                    self.renderDom();
                },
                error: function () {
                    console.log('获取信息失败')
                }
            })
        },
        // 渲染
        renderDom: function () {
            var self = this;
            var str = '';
            var dataList = self.dataList.data;
            console.log(dataList);
            var len = dataList.length;
            if(len > 0) {
                for(var i = 0; i < len; i++) {
                    str += ' <tr>\
                    <td>' + dataList[i].sNo + '</td>\
                    <td>' + dataList[i].name + '</td>\
                    <td>'+ (dataList[i].sex ? '女' : '男') + '</td>\
                    <td>'+ dataList[i].email + '</td>\
                    <td>'+ (new Date().getFullYear() - dataList[i].birth) + '</td>\
                    <td>' + dataList[i].phone + '</td>\
                    <td>' + dataList[i].address + '</td>\
                    <td>\
                        <button class="success edit" data-index=' + i + '>编辑</button>\
                        <button class="del" data-index=' + i + '>删除</button>\
                    </td>\
                    </tr>'
                }
                var tbody = $('#students-table').find('tbody');
                tbody.html(str);
                this.show();
            }
        },
        show: function () {
            var self = this;
            $('.edit').on('click', function () {
                $('.modal').show();
                // 编辑按钮 获取当前这行信息  填入到弹出框信息栏中
                var i = $(this).attr('data-index');
                var data = self.dataList.data[i];
                console.log(i);
                var form = $('#modal-form')[0];
                for(var prop in data) {
                    form[prop] ? form[prop].value = data[prop] : '';
                }
            });
            // 编辑提交按钮
            $('.submit').on('click', function () {
                var data = self.getFormData($('#modal-form'));
                // 传给后端存入数据库
                // console.log(data);
                $.ajax({
                    url: 'http://api.duyiedu.com/api/student/updateStudent?appkey=he19980804__1547825419047',
                    data: data,
                    success: function (data) {
                        $('.modal').hide();
                        alert('修改成功');
                        $('.student-list').trigger('click');
                    }
                })
            });
            // 删除按钮
            $('.del').on('click', function () {
                $('.del-modal').show();
                var i = $(this).attr('data-index');
                var num = self.dataList.data[i].sNo;
                $('.sure-btn').on('click', function () {
                    $.ajax({
                        url: 'http://api.duyiedu.com/api/student/delBySno?appkey=he19980804__1547825419047',
                        data: {
                            sNo: num
                        },
                        success: function (data) {
                            $('.del-modal').hide();
                            $('.left-menu .student-list').trigger('click');
                        },
                        error: function () {
                            alert('删除失败');
                        }

                    })
                })
            })
        },
        getFormData: function (formData) {
            var list = formData.serializeArray();
            // console.log(list);
            var student = {};
            list.forEach(function (ele) {
                student[ele.name] = ele.value;
            });
            return student;
        },
        saveData: function (url, param) {
            $.ajax({
                url: url,
                type: 'GET',
                data: param,
                success: function (data) {
                    alert('新增成功');
                    $('.student-list').trigger('click');
                },
                error: function () {
                    alert('添加失败');
                }
            })
        }
    }
    obj.init();
})();