<template>
	<view class="postlist">
		<post-card 
			v-for="(post,index) in posts"
			:key="post._id"
			:post="post"
		/>
	</view>
	<uni-icons type="compose" size="30" color="#5351ff" v-if="!isLogin" class="btn-add" @click="toAddPost"></uni-icons>
	
	<popup-bottom :ItemType="ItemType" ></popup-bottom>

</template>

<script>
	import {get,post,del} from '../../api/request';
	import store from '../../store'
	import {mapState,mapMutations } from 'vuex';

	export default {
		data() {
			return {
				list: [],
				pageSize: 4,
				pageIndex: 1,
				total: 0,
				isLoading: false,
				ItemType:'post'
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
			...mapMutations({
				setPosts: 'post/setPosts' 
			}),
			getPostList() {
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
						isOwn: userId === item.author._id
					}));
					this.setPosts(this.list)
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
		},
		computed: {
			...mapState({
				posts:state=>state.post.posts
			}),
			isLogin() {
				return !store.getters['user/token']
			}
		}
	}
</script>

<style lang="scss">
	@import'../../common/common.scss';
	
	.btn-add {
		position: fixed;
		right: 30px;
		bottom: 30px;
		width: 30px;
		height: 30px;
		border: 1px solid $btn-border-color;
		border-radius: 50%;
		padding: 5px;
		background-color: $bg-color-white;
	}
</style>