<template>
    <div class="huadong">
        <van-tabs v-model="active" class="share_navtab" @click="onClick">
            <!-- 家园共育大讲堂 -->
            <van-tab :title="item.name" :name="item.id" v-for="item in tabtypes" :key="item.id">
                <!-- {{tabtypes[0].id}} -->
                <div class="social_dropdown">
                    <div></div>
                    <dropdown :options="option" :tvalue="defaultvalue" @change="change"></dropdown>
                </div>
                <div class="share_refresh">
                    <van-pull-refresh v-model="refreshing" success-text="刷新成功" @refresh="onRefresh" >
                    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad"
                        :immediate-check="false">
                        <div class="social_list">
                            <router-link to="/sharefamily_detail" v-for="(items, index) in yrlist" :key="index" class="traverse">
                                <generallist :img="items.images" :title="items.title" :content="items.content" :flage="items.flage"></generallist>
                            </router-link>
                        </div>
                    </van-list>
                    </van-pull-refresh>
                </div>

            </van-tab>
        </van-tabs>
    </div>
</template>

<script>
    import dropdown from "@/components/dropdown.vue";
    import generallist from "@/components/generallist.vue";
    export default {
        name: "Homeproduced",
        components: {
            generallist,
            dropdown,
        },
        data() {
            return {
                //选项卡分类
                tabtypes: [],
                active: 0, //选项卡默认值
                defaultvalue: 0, //班级数据默认值

                // 家园共育讲堂
                loading: false,
                finished: false, // 上拉加载完毕
                refreshing: false, //下拉加载
                pageSize: '', // 每页条数
                pageIndex: 1, // 页码

                yrlist: [], //家园数据

                // isIf: 1,
                option: [],

            };
        },
        mounted() {
            this.$toast.loading({
                message: '加载中...',
                forbidClick: true,
                duration: 0
            });
            // 获取选项卡分类
            var id = this.$route.query.id;
            this.$api.getclassify(id)
                .then(res => {
                    if (res.code == 1) {
                        if (res.data.length > 0) {
                            this.tabtypes = res.data;
                            this.$set(this.$data, 'active', this.tabtypes[0].id);
                            // 获取班级接口
                            this.$api.postclass()
                                .then(res => {
                                    if (res.code == 1) {
                                        if (res.data.length > 0) {
                                            res.data.forEach((item, index) => {
                                                var obj = {
                                                    text: item.name,
                                                    value: item.id
                                                }
                                                this.option.push(obj)
                                            })
                                            this.$set(this.$data, 'defaultvalue', this.option[0].value);
                                            // 默认请求数据
                                            this.loading = true;
                                            this.finished = false;
                                            this.pageIndex = 1
                                            this.yrlist=[]
                                            this.getlist(this.active, this.defaultvalue, this.pageIndex)
                                        }
                                    }
                                })

                        }
                    }
                })

        },
        methods: {
            // 选项卡的改变
            onClick(name, title) {
                this.active = name;
                this.loading = true;
                this.finished = false;
                this.pageIndex = 1
                this.yrlist=[]
                this.getlist(name,this.defaultvalue,this.pageIndex)
            },
            // 下拉选择框的改变
            change(val) {
                this.loading = true;
                this.finished = false;
                this.pageIndex = 1
                this.yrlist=[]
                this.defaultvalue = val;
                this.getlist(this.active,val,this.pageIndex)
            },
            // 数据请求
            getlist(cid, gread_id, page) {
                this.$api.sharemore(cid, gread_id, page)
                    .then(res => {
                        if (res.code == 1) {
                            this.$toast.clear()
                            this.loading = false;
                            this.refreshing = false
                            this.pageSize = res.data.per_page;
                            // 数据为空
                            if (res.data.length === 0) {
                                console.log("没有数据")
                                this.finished = true
                                return
                            }
                            if (res.data.data.length < res.data.per_page) {
                                // 不足10条
                                console.log('不再请求')
                                this.finished = true;
                            }else{
                                console.log("还可以请求")
                                this.finished = false;
                                this.pageIndex++;
                            }
                            const rows = res.data.data;
                            this.yrlist = this.yrlist.concat(rows);
                        }
                    })
            },
            // 家园共育大讲堂
            onRefresh() {
               this.refreshing = true
               this.loading = true;
               this.finished = false;
               this.pageIndex = 1
               this.yrlist=[]
               this.getlist(this.active,this.defaultvalue,this.pageIndex)
            },
            onLoad() {
                this.loading = true;
                this.finished = true;
                this.getlist(this.active,this.defaultvalue,this.pageIndex)
            }
        },
    };
</script>

<style scoped="scoped">
    .flexRight {
        display: flex;
        justify-content: space-between;
    }

    .huadong {
        flex: 1;
        overflow: hidden;
    }

    .share_navtab {
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .share_navtab>>>.van-tab--active {
        color: #bfdd0c;
    }

    .share_navtab>>>.van-tabs__line {
        width: 50%;
        background-color: #bfdd0c;
        height: 2px;
    }

    .share_navtab>>>.van-tabs__content {
        flex: 1;
        overflow: auto;
    }

    .traverse {
        display: block;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
        border-radius: 5px;
        margin-bottom: 10px;
        padding: 10px 0px;
    }

    .generaltext>h3 {
        font-size: 14px !important;
        color: #666666;
    }

    .generaltext>p {
        color: #d0d0d0 !important;
        font-size: 12px;
    }

    .sharefamily_detail {
        flex: 1;
        overflow: auto;
    }

    /* .van-tab__pane, .van-tab__pane-wrapper{} */
    .share_refresh {
        height: calc(100% - 52px);
    }

    /* 下拉选择*/
    .social_dropdown {
        padding: 10px 15px;
        display: flex;
        justify-content: space-between;
    }

    .social_list {
        padding: 2px 15px;
    }

    .social_dropdown>>>.van-dropdown-menu {
        border: 1px solid #aaca0b;
        border-radius: 2px;
    }

    .social_dropdown>>>.van-dropdown-menu__bar {
        height: 30px;
    }

    .social_dropdown>>>.van-dropdown-menu__title {
        padding: 0 15px 0px 8px;
    }

    .social_dropdown>>>.van-dropdown-menu__title::after {
        border-color: transparent transparent #aaca0b #aaca0b;
    }

    .social_dropdown>>>.van-ellipsis {
        font-size: 14px;
    }

    .huadong>>>.van-tab__pane {
        height: 100%;
    }
</style>
