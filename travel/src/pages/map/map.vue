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
        <div class="search">
            <input type="text" v-model="address" ref="searchtext">
            <button @click="search">搜索</button>
        </div>
        <!-- 地图容器 -->
        <div id="container" class="mymap" ref="container"></div>

        <!-- 搜索信息面板 -->
        <div id="panel" ref="panel" class="amap_lib_placeSearch">
            <!-- <div class="amap_lib_placeSearch_list amap-pl-pc" v-for="(item,index) in poiArr" @click="openMarkerTipById1(index,$event)" @mouseout="onmouseout_MarkerStyle(index+1,$event)" :key="index"> -->
                <!-- 每一条数据 -->
               <!-- <div class="poibox" style="border-bottom: 1px solid #eaeaea;">
                    <div class="amap_lib_placeSearch_poi poibox-icon" :class="index==selectedIndex?'selected':''">{{index+1}}</div>
                    图片
                    <div class="poi-img" v-if="item.url" :style="'background-image:url('+item.url+'?operate=merge&amp;w=90&amp;h=56&amp;position=5)'"></div>
                    标题
                    <h3 class="poi-title">
                        <span class="poi-name">大厦</span>
                    </h3>
                    地址电话
                    <div class="poi-info">
                        <p class="poi-addr">地址：{{item.address}}</p>
                        <p class="poi-tel">电话：{{item.tel}}</p>
                    </div>
                    <div class="clear"></div>
                </div> -->
            <!-- </div> -->
        </div>


    </div>
</template>

<script>
    import AMap from 'AMap';
    export default {
        data() {
            return {
                // map:'',
                currentcity: '', //当前市，用来请求天气
                detailaddress: '', //用来存放定位详细地址
                wether: '', //存放天气天气
                address: '', //搜索框的值
                poiArr: [{
                    address: '111',
                    tel: '222'
                }], //左边搜索出来的数组
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
                // 文本框的值
                var searchtext = this.$refs.searchtext;
                var autoOptions = {
                    input: searchtext
                };
                var auto = new AMap.Autocomplete(autoOptions);
                var placeSearch = new AMap.PlaceSearch({
                   map: map
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
            // 搜索地址
            placeSearch(name) {
                // 文本框的值
                
                // 搜索内容

                var panel = this.$refs.panel;
                var that=this;
                var MSearch;
                AMap.service(["AMap.PlaceSearch", "AMap.ToolBar", "AMap.Scale"], function() {
                    AMap.addControl(new AMap.ToolBar())
                    AMap.addControl(new AMap.Scale())
                    MSearch = new AMap.PlaceSearch({
                        //构造地点查询类
                        city: name ,//城市
                        pageSize: 5, // 单页显示结果条数
                        pageIndex: 1, // 页码
                        // city: "010", // 兴趣点城市
                        citylimit: true,  //是否强制限制在设置的城市内搜索
                        map: that.init, // 展现结果的地图实例
                        panel: "panel", // 结果列表将在此容器中进行展示。
                        autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围

                    });
                    AMap.event.addListener(MSearch, "complete", keywordSearch_CallBack) //返回地点查询结果
                   
                    MSearch.search('晋中'); //关键字查询
                });
            },
            keywordSearch_CallBack(){

            },
            search() {
                console.log(1111)
                // this.init()
                var that=this;
               // this.mapObj=''
                // this.mapInit()
               // this.init();
               that.placeSearch(that.currentcity)
                console.log(that.currentcity)
            }


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
    /* 地图容器*/
    #container{width: 100%;height: 100%;position: relative;border: 1px solid #25A4BB;}
    /* 搜索信息面板*/
    .amap_lib_placeSearch{position: fixed;background-color: white;overflow-y: auto;width: 280px;top: 100px;height: 400px;border: 1px solid red;}
    .amap_lib_placeSearch .poibox{border-bottom: 1px solid #eaeaea;cursor: pointer;padding: 5px 0 5px 10px;position: relative;min-height: 35px;}
    .amap_lib_placeSearch .amap_lib_placeSearch_poi{position: absolute;}
    .amap_lib_placeSearch .poibox .poi-info{word-break: break-all;margin: 0 0 0 25px;overflow: hidden;}
    .amap_lib_placeSearch .poibox .poi-info p{color: #999;font-family: Tahoma;line-height: 20px;font-size: 12px;}
    .amap_lib_placeSearch .poibox .poi-title{margin-left: 25px;font-size: 13px;overflow: hidden;}
    #panel .amap-call{background-color: #009cf9;border-top-left-radius: 4px;border-top-right-radius: 4px;}
    #panel .amap-lib-driving{border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;overflow: hidden;}
</style>
