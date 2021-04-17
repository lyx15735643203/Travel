<template>
    <div class="map">
        <div id="container" class="mymap" ref="container"></div>
    </div>
</template>

<script>
    import AMap from 'AMap';
    export default {
        data() {
            return {
                // map:'',
            }
        },
        methods: {
            init() {
                var dom=this.$refs.container;
                console.log(dom)
                var map = new AMap.Map(dom, {
                    center: [116.397428, 39.90923], //中心点坐标
                    zoom: 11, //级别
                    resizeEnable: true
                })
            }
        },
        mounted() {
            this.init();
        },
    }
</script>

<style scoped="scoped">
    * {margin: 0;padding: 0;box-sizing: border-box;text-decoration: none;list-style: none;}
    body,html {width: 100%;height: 100%;}
    .mymap {width: 100%;height: 500px;}
</style>
