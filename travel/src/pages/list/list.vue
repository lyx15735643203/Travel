<template>
    <div class="home">
        <homeheader></homeheader>
    </div>
</template>

<script>
    import homeheader from '@/components/homeheader.vue'
    export default {
        name: 'HelloWorld',
        data() {
            return {
                msg: 'Welcome to Your Vue.js App'
            }
        },
        components: {
            homeheader
        },
    }
</script>

<style scoped>

</style>
