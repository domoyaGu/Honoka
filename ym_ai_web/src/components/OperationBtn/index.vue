<template>
	<span class="table-btn">
    <svg-icon :icon-class="iconClass" style="margin-right: 4px;"/>
    <span class="text">{{text}}</span>
  </span>
</template>

<script lang="ts" setup>

defineProps({
	iconClass: {
		type: String,
		default: ""
	},
	// 文字
	text: {
		type: String,
		default: ""
	}
});
</script>

<style lang="scss" scoped>
</style>