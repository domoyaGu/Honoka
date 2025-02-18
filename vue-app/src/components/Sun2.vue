<template>
  <div>
    <p>子组件2：{{}}</p>
    <button @click="send">给</button>
  </div>
</template>

<style lang="less" scoped>

</style>

<script>
export default {
  name: '',
  mounted() {
    
  },
  data() {
    return {

    }
  },
  methods:{
    send() {
        this.$bus.$emit("test", "okk")
    }
  }
}
</script>
