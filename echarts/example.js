/**
 * Created by L.H.S on 2017/8/17.
 */

window.onload = function () {

    var myChart = echarts.init(document.getElementById('myChart'));

    var Xais = getXais();

    var data1 = getLineData(1);
    var data2 = getLineData(2);
    var data3 = getLineData(3);
    var data4 = getScatterData();

    var option = {
        title: {
            text: '图标大杂烩 @copyright howSure'
        },
        tooltip: {
            trigger: 'axis',
            // formatter: function (params) {
                // 在此处重写annotation，打印一下params可以看到里面有需要的所有数据
                // trust html
                // console.log(params)
            // }
        },
        toolbox: { // 右上角的工具盒
            show: true,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                dataView: {readOnly: false},
                magicType: {type: ['line', 'bar']},
                restore: {},
                saveAsImage: {}
            }
        },
        legend: {
            data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
        },
        dataZoom: [{ // 伸缩轴
            type: 'slider',  // 滑动条
            xAxisIndex: [0, 1, 2], // 指定哪些图共用该伸缩轴
            realtime: true,
            start: 20,
            end: 70,
            top: 65,
            height: 20,
            handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '120%'
        }, {
            type: 'inside',  // 内部滚轴以及拖拽
            xAxisIndex: [0, 1, 2],
            start: 40,
            end: 70,
            top: 30,
            height: 20
        }],
        grid: [{  // 布局
            left: 40,
            right: 40,
            top: 110,
            height: 150
        }, {
            left: 40,
            right: 40,
            height: 120,
            top: 300
        }, {
            left: 40,
            right: 40,
            height: 150,
            top: 450
        }],
        xAxis: [{  // 几张图，几个xAxis，yAxis
            type: 'category',
            boundaryGap: false,
            data: Xais,
            gridIndex: 0
        }, {
            type: 'category',
            boundaryGap: false,
            data: Xais,
            gridIndex: 1
        }, {
            type: 'category',
            data: Xais,
            gridIndex: 2,
            boundaryGap: false,
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#999',
                    type: 'dashed'
                }
            },
            axisLine: {
                show: false
            }
        }],
        yAxis: [{
            type: 'value',
            gridIndex: 0
        }, {
            type: 'value',
            gridIndex: 1
        }, {
            type: 'category',
            gridIndex: 2,
            data: ['1st', '2nd', '3rd'],
            axisLine: {
                show: false
            }
        }],
        series: [
            {
                name: '邮件营销',
                xAxisIndex: 0,
                yAxisIndex: 0,
                type: 'line',
                data: data1.data,
                smooth: true,  // 拐点圆滑（false-尖角）
                markLine: {
                    data: [{
                        type: "average"
                    }]
                },
                itemStyle: {
                    normal: {  // 改变整个series的颜色，包括数据点，以及formatter中的param.color
                        color: 'red'
                    }
                }
            },
            {
                name: '联盟广告',
                xAxisIndex: 0,
                yAxisIndex: 0,
                type: 'line',
                data: data2.data,
                smooth: true,
                markLine: {
                    data: [{
                        type: "average"
                    }]
                },
                itemStyle: {
                    normal: {
                        color: 'orange'
                    }
                }
            },
            {
                name: '视频广告',
                xAxisIndex: 1,
                yAxisIndex: 1,
                type: 'line',
                data: data3.data,
                smooth: true,
                markLine: {
                    data: [{
                        yAxis: data3.avg  // 此处可以通过type、yAxis、xAxis来制定水位线
                    }]
                },
                itemStyle: {
                    normal: {
                        color: 'green'
                    }
                }
            }, {
                type: 'custom',  // 自定义图形，此处type为custom
                xAxisIndex: 2,
                yAxisIndex: 2,
                renderItem: renderItem,
                data: data4,
                animationDelay: function (idx) {
                    return idx * 5;
                }
            }
        ],
        visualMap: [{  // 不同折线片段不同颜色
            show: false,
            dimension: 1,  // 0-垂直方向；1-水平方向
            seriesIndex: 0,
            pieces: [{
                gt: 0,
                lte: data1.avg,
                color: 'red',
                colorAlpha: 0.2  // 颜色透明度
            }, {
                gt: data1.avg,
                lte: 10000,
                color: 'red'
            }]
        }, {
            show: false,
            dimension: 1,
            seriesIndex: 1,
            pieces: [{
                gt: 0,
                lte: data2.avg,
                color: 'orange',
                colorAlpha: 0.2
            }, {
                gt: data2.avg,
                lte: 10000,
                color: 'orange'
            }]
        }, {
            show: false,
            dimension: 1,
            seriesIndex: 2,
            pieces: [{
                gt: 0,
                lte: data3.avg,
                color: 'green',
                colorAlpha: 0.2
            }, {
                gt: data3.avg,
                lte: 10000,
                color: 'green'
            }]
        }]
    };

    myChart.setOption(option);
};

// 自定义图形，此处需要使用svg路径
// 依次是圆形、三角形、五边形
var svgPath = [
    "m76.5,124.5c0,-8.56354 6.93646,-15.5 15.5,-15.5c8.56354,0 15.5,6.93646 15.5,15.5c0,8.56354 -6.93646,15.5 -15.5,15.5c-8.56354,0 -15.5,-6.93646 -15.5,-15.5z",
    "m63.1875,76.61313l17,-29.75l17,29.75l-34,0z",
    "m70.1525,87.86015l19.49998,-14.18729l19.50002,14.18729l-7.44831,22.95561l-24.10335,0l-7.44833,-22.95561z"
];
var colors = ['red', 'orange', 'green'];
function renderItem(params, api) {

    var val = api.value(2);
    if (val == 0) {
        return;
    }

    var xPos = api.value(1);
    var yPos = api.value(0);

    var point = api.coord([yPos, xPos]); // 定位
    var itemSize = val * 10;

    return {
        type: 'path',
        shape: {
            pathData: svgPath[xPos],
            width: itemSize,
            height: itemSize,
            x: -itemSize / 2,
            y: -itemSize / 2
        },
        position: point,
        style: api.style({
            fill: colors[xPos]
        })
    }
}

function getXais() {
    var xAxis = [];

    var today = new Date(Date.parse("2017-08-17"));
    for (var i = 0; i < 50; i++) {
        xAxis.push(echarts.format.formatTime("yyyy-MM-dd", today));  // 格式化时间
        today.setDate(today.getDate() + 1);
    }

    return xAxis;
}

// 生成随机数据
function getLineData(dig) {
    var data = [];
    var sum = 0;
    for (var i = 0; i < 50; i++) {
        var rand = Math.floor(dig * 1000 + Math.random() * 4000);
        sum += rand;
        data.push(rand);
    }

    return {
        data: data,
        avg: sum / data.length
    };
}

function getScatterData() {

    var data = [];
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 50; j += 2) {
            data.push([j, i, Math.floor(Math.random() * 5)]);  // 注意此处i和j顺序
        }
    }

    return data;
}
