(function () {
    var obj = {
        init: function () {
            this.getData();
            this.option = {
                title: {
                    text: '',
                    subtext: '纯属虚构',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    // data: legendArr,
                    // data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        // data: [
                        //     { value: 335, name: '直接访问' },
                        //     { value: 310, name: '邮件营销' },
                        //     { value: 234, name: '联盟广告' },
                        //     { value: 135, name: '视频广告' },
                        //     { value: 1548, name: '搜索引擎' }
                        // ],
                        // data: seriesArr,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
        },
        getData: function () {
            var self = this;
            $.ajax({
                url: 'http://api.duyiedu.com/api/student/findAll?appkey=he19980804__1547825419047',
                type: 'GET',
                success: function (data) {
                    var data = JSON.parse(data);
                    // console.log(data.data);
                    // list = data.data;
                    self.getAreaChart(data.data);
                    self.getSexChart(data.data);
                    // console.log(legendArr, numObj, seriesArr);
                }
            });
        },
        getAreaChart: function (list) {
            var legendArr = [];
            var seriesArr = [];
            var numObj = {};
            list.forEach(function (ele, index) {
                if (!numObj[ele.address]) {
                    numObj[ele.address] = 1;
                    legendArr.push(ele.address);
                } else {
                    numObj[ele.address]++;
                }
            })

            for (var prop in numObj) {
                var obj = {};
                obj.name = prop;
                obj.value = numObj[prop];
                seriesArr.push(obj);
            }

            var myChart = echarts.init(document.getElementsByClassName('area')[0]);
            this.option.title.text = '地区分布';
            this.option.legend.data = legendArr;
            this.option.series[0].data = seriesArr;
            var option = this.option;

            myChart.setOption(option);
        },
        getSexChart: function (list) {
            var mySexChart = echarts.init($('.sex')[0]);
            // 数据格式的转换
            var legendArr = ['男', '女'];
            var seriesArr = [];
            var numObj = {};
            list.forEach(function (ele, index) {
                if (!numObj[ele.sex]) {
                    numObj[ele.sex] = 1;
                } else {
                    numObj[ele.sex]++;
                }
            })
            seriesArr = [{ value: numObj[0], name: '男' }, { value: numObj[1], name: '女' }]

            this.option.title.text = '性别比例';
            this.option.legend.data = legendArr;
            this.option.series[0].data = seriesArr;
            var option = this.option;

            mySexChart.setOption(option);

        }
    }

    obj.init()

})()