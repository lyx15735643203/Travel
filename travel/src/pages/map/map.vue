<template>
    <div class="map">
        <!-- 定位天气 -->
        <div class="topinfo">
            <!-- 定位 -->
            <div class="info">
                <p id='info'>您当前所在城市:{{detailaddress}}</p>
            </div>
            <!-- 天气 -->
            <div class="wether">
                <p id='wether'>&nbsp;&nbsp;&nbsp;&nbsp;天气:{{wether}}</p>
            </div>
        </div>
        <!-- 搜索 -->
        <div class="search" id="myPageTop">
           <!-- <input type="text" v-model="address" ref="searchtext">
            <button @click="search">搜索</button> -->
            <table>
                <tr>
                    <td>
                        <label>请输入关键字：</label>
                    </td>
                    <td>
                        <input id="tipinput" ref="tipinput"/>
                    </td>
                </tr>
            </table>
        </div>
        <!-- 地图容器 -->
        <div id="container" class="mymap" ref="container"></div>
		<!-- 面板 -->
		<div id="panel" ref="panel"></div>

    </div>
</template>

<script>
    import AMap from 'AMap';
    export default {
        data() {
            return {
                // map:'',
                currentcity: '', //当前市，用来请求天气
				citycode:'', //当前市，编码
                detailaddress: '', //用来存放定位详细地址
                wether: '', //存放天气天气


            }
        },
        methods: {
            init() {
                var that = this;
                // 容器
                var container = this.$refs.container;
                // 绘制地图
                var map = new AMap.Map(container, {
                    resizeEnable: true,
                    // center: [116.397428, 39.90923], //地图中心点
                    zoom: 13 //地图显示的缩放级别
                })

                

                // 输入提示后搜索
                var tipinput = this.$refs.tipinput;
                var autoOptions = {
                    input: tipinput
                };
                var auto = new AMap.Autocomplete(autoOptions);
                var placeSearch = new AMap.PlaceSearch({
                   map: map,
                   city: "0351", // 限制搜索地点
                });
                AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
                function select(e) {
                    placeSearch.setCity(e.poi.adcode);
                    placeSearch.search(e.poi.name);  //关键字查询查询
                }

				AMap.service(["AMap.PlaceSearch"], function() {
				//构造地点查询类
				var placeSearch = new AMap.PlaceSearch({
					pageSize: 5, // 单页显示结果条数
					pageIndex: 1, // 页码
					city: "0351", // 兴趣点城市
					citylimit: true,  //是否强制限制在设置的城市内搜索
					map: map, // 展现结果的地图实例
					panel: "panel", // 结果列表将在此容器中进行展示。
					autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
				});
				//关键字查询
				placeSearch.search('太原站');
    });
            },
            // 定位到精确位置
            getLocation() {
                const that = this
                AMap.plugin('AMap.Geolocation', function() {
                    var geolocation = new AMap.Geolocation({
                        enableHighAccuracy: true, // 是否获取高精度定位，可能影响效率，默认false
                        timeout: 10000, // 定位超时时间，ms
                        needAddress: true, // 是否需要将定位结果进行逆地理编码操作
                        extensions: 'all', // 是否需要详细的你地理编码信息，默认'base'
                    })
                    // 获取精确位置
                    geolocation.getCurrentPosition()
                    AMap.event.addListener(geolocation, 'complete', onComplete)
                    AMap.event.addListener(geolocation, 'error', onError)
                
                    function onComplete(data) {
                        // data是具体的定位信息
                        console.log(data, '获取精确位置')
                        that.detailaddress = data.formattedAddress;
                        that.currentcity=data.addressComponent.city;
                		 that.citycode=data.addressComponent.citycode;
                        // 天气
                        that.Weather(data.addressComponent.city);
                        // 搜索
                        // that.search(data.addressComponent.city);
                    }
                
                    function onError(data) {
                        // 定位出错
                        console.log(data, '定位出错');
                        that.getLngLatLocation()
                    }
                })
            },
            getLngLatLocation() {
                var that = this;
                AMap.plugin('AMap.CitySearch', function() {
                    var citySearch = new AMap.CitySearch()
                    citySearch.getLocalCity(function(status, result) {
                        if (status === 'complete' && result.info === 'OK') {
                            // 查询成功，result即为当前所在城市信息
                            // 获取当前城市天气
                            // console.log('通过ip获取当前城市：', status,result)
                            that.currentcity = result.city;
                            that.Weather(that.currentcity);
                            //逆向地理编码详细地址
                            AMap.plugin('AMap.Geocoder', function() {
                                var geocoder = new AMap.Geocoder({
                                    // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                                    city: result.adcode
                                })
                                // 获取经纬度
                                var lnglat = result.rectangle.split(';')[0].split(',')
                                geocoder.getAddress(lnglat, function(status, data) {
                                    if (status === 'complete' && data.info === 'OK') {
                                        console.log(data, '城市级别的定位信息')
                                        // result为对应的地理位置详细信息
                                        that.detailaddress = data.regeocode.formattedAddress;
                                    }
                                })
                            })
                        }
                    })
                })
            },
            // 获取当前城市的天气
            Weather(Weather) {
                var that = this;
                AMap.plugin('AMap.Weather', function() {
                    //创建天气查询实例
                    var weather = new AMap.Weather();
                    //执行实时天气信息查询
                    weather.getLive(Weather, function(err, data) {
                        // console.log(data.weather);
                        that.wether = data.weather;
                    });
                });
            },



        },
        mounted() {
            // 初始化地图
            this.init();
            // 定位精确位置
            this.getLocation();

            // getLocation()
        },
    }
</script>

<style scoped="scoped">
    *{margin: 0;padding: 0;box-sizing: border-box;text-decoration: none;list-style: none;}
    body, html{width: 100%;height: 100%;}
    /* 最外层*/
    .map{width: 100%;height: 100%;display: flex;flex-direction: column;}
    /* 定位*/
    .topinfo{width: 100%;background-color: #fff;box-shadow: 0px 0px 1px #000;display: flex;padding: 10px;border: 1px solid #00BCD4;margin-bottom: 10px;height: 40px;align-items: center;}
    /* 搜索*/
    .search{display: flex;border: 1px solid #25A4BB;margin-bottom: 10px;}
    .search input{height: 40px;width: 30%;}
    .search button{height: 40px;width: 80px;background-color: #BFDD0C;border: none;margin-left: 30px;color: red;}
    #tipinput{width: 200px;}
    /* 地图容器*/
    #container{width: 100%;height: 100%;position: relative;border: 1px solid #25A4BB;}
    /* 面板 */
    #panel {position: absolute;background-color: white;max-height: 90%;overflow-y: auto;top: 10px;right: 10px;width: 280px;}
</style>
