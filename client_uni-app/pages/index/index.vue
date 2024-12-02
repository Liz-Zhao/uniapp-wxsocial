<template>

	
	<post-list :list="list" :removeItem="removeItem"></post-list>
	<uni-icons type="compose" size="30" color="#5351ff" v-if="!isLogin" class="btn-add" @click="toAddPost"></uni-icons>


</template>

<script>
	import {
		get
	} from '../../api/request';
	import store from '../../store'

	export default {
		data() {
			return {
				list: [],
				pageSize: 4,
				pageIndex: 1,
				total: 0,
				isLoading: false,
				
			}
		},
		async onLoad() {
			
			 while (!store.getters['user/userAuth']) {
			   // 如果登录未完成，等待
			   // console.log('isLoginComplete is: ',store.getters['user/userAuth'])
			   await new Promise(resolve => setTimeout(resolve, 500)); // 暂停一段时间再检查
			 }
				 
			const userInfo = uni.getStorageSync('userAuth');
			if(userInfo){
				await this.getPostList();
			}else{
				uni.navigateTo({
					url:'/pages/LoginPage/LoginPage'
				})
			}
		},
		// 下滑
		onPullDownRefresh() {
			this.list = []
			this.getPostList()

		},
		// 上拉
		onReachBottom() {
			if (this.pageIndex * this.pageSize >= this.total) {
				return

			}
			if (this.isLoading) {
				return
			}

			this.pageIndex = this.pageIndex + 1;
			this.getPostList()
		},
		methods: {
			async getPostList() {
				this.isLoading = true;
				get({
					url: "/posts",
					data: {
						limit: this.pageSize,
						page: this.pageIndex
					},
				}).then((res) => {
					
					this.list = [...this.list, ...res.data]
					const userId = store.getters['user/user_id'];
					this.list = this.list.map((item) => ({
						...item,
						isliked: item.likedBy.includes(userId),
					}));
					this.total = res.counts;
					this.isLoading = false;
				}).finally(() => {
					this.isLoading = false;
				})

			},
			toAddPost() {
				uni.navigateTo({
					url: '/pages/addPost/addPost',
					animationType: 'pop-in',
					animationDuration: 200
				});
			},
			removeItem(deletedPostID){
				this.list = this.list.filter((item)=>item._id !== deletedPostID)
			}

		},
		computed: {
			isLogin() {
				return !store.getters['user/token']
			}
		}
	}
</script>

<style>
	.btn-add {
		position: fixed;
		right: 30px;
		bottom: 30px;
		width: 30px;
		height: 30px;
		border: 1px solid #ccc;
		border-radius: 50%;
		padding: 5px;
		background-color: #fff;
	}
</style>