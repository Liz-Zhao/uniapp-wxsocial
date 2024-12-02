<template>
	
	<post-card v-for="(item,index) in list" :key="index" v-bind:post="item" ></post-card>
	
	<popup-bottom @delete='removePostItem'></popup-bottom>
	
</template>

<script>
	export default {
		name:"post-list",
		data() {
			return {
			};
		},
		props:{
			list:{
				type:Array,
				default:[]
			},
			removeItem:{
				type:Function,
				default:(deletedPostID)=>{}
			}
		},
		methods:{
			removePostItem(deletedPostID){
				this.removeItem(deletedPostID)
			}
		},
		computed:{
			
		}
	}
</script>

<style>

</style>