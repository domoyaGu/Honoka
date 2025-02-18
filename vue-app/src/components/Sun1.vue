<template>
  <div>
    <p>子组件1：</p>
  </div>
</template>

<style lang="less" scoped>

</style>

<script>
export default {
  name: '',
  mounted() {
    this.$bus.$on("test", data => {
      console.log(data)
    })
  },
  data() {
    return {

    }
  },
  methods:{

  }
}
</script>
