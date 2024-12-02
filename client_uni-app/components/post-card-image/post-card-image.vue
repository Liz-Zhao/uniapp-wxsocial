<template>
	<view class="image-context" v-if="getLen == 1">
		<image :src="images[0]" mode="aspectFill" style="height: 248px; width: 100%;margin-bottom: 10px;"></image>
	</view>
	<view class="image-context" v-else-if="getLen == 2" style="display: flex; gap: 5px;margin-bottom: 10px;">
		<image :src="images[0]" mode="aspectFill" style="height: 148px; width: 50%;"></image>
		<image :src="images[1]" mode="aspectFill" style="height: 148px; width: 50%;"></image>
	</view>
	<view class="image-context" v-else-if="getLen >= 3" style="display: grid; grid-template-columns: 60% 40%; grid-template-rows: 120px 120px; gap: 5px;margin-bottom: 10px;">
		<image :src="images[0]" mode="aspectFill" style="grid-row: 1/3; width: 100%;height: 100%;"></image>
		<image :src="images[1]" mode="aspectFill" style="width: 100%;height: 100%;"></image>
		<image :src="images[2]" mode="aspectFill" style="width: 100%;height: 100%;"></image>
	</view>
	
</template>

<script>
	export default {
		name:"post-card-image",
		props:{
			images:{
				type:Array
			}
		},
		data() {
			return {
				
			};
		},
		computed:{
			getLen(){
				if(!this.images){
					return 0
				}
				return this.images.length
			}
		}
	}
</script>

<style>

</style>