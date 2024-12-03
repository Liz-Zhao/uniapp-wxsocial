<template>
	<view class="avatar-box">
		<image :src="avatar" mode="aspectFill" class="avatar" @click="handlerUpdateAvatar"></image>
		<uni-icons type="compose" size="30" color="#5351ff" class="btn-edit"></uni-icons>
	</view>
	<view class="user-form">
		<view class="form-item">
			<text>昵称</text> 
			<input v-model="username"  />
		</view>
		<view class="form-item">
			<text>自我介绍</text>
			<textarea v-model="desc" placeholder="自我介绍" />
		</view>
	</view>
	<view class="btns-box">
		<button @click="handlerSave" class="btn-save">保存</button>
		<button @click="handlerExit" class="btn-exit">退出登录</button>
	</view>
	
	
</template>

<script>
	import { get, post } from '../../api/request';
	import store from '../../store'
	
	export default {
		data(){
			return {
				avatar:'',
				_avatar:'',
				username:'',
				desc:'',
				token: store.getters['user/token'],
				
			}
		},
		onLoad() {
			this.getUserData()
		},
		methods:{
			handlerUpdateAvatar(){
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						const addImages = res.tempFilePaths;

						uni.uploadFile({
							url: 'http://127.0.0.1:3000/upload/file', 
							filePath: addImages[0],
							name: 'file',
							fileType:"image",
							header:{
								Authorization:'Bearer '+this.token,
								'Content-Type': 'multipart/form-data'
							},
							success: () => {
								const match = addImages[0].match(/tmp\/(.+)$/);
								this._avatar=match[1]
								// 1. 将新数组 push 到 images 中
								this.avatar= addImages[0];
								  
							},
							
						});
						
						
					}
				});
			},
			handlerSave(){
				const query = this._avatar ? {
					description: this.desc,
					profilePic: this._avatar,
					username:this.username
				} : {
					description: this.desc,
					username:this.username
				};
				
				post({url:"/user", data:query}).then((res)=>{
					uni.showToast({
						title:'修改成功！'
					})
					this.getUserData();
					let userAuth = store.getters['user/userAuth'];
					userAuth = {
						...userAuth,
						username: this.username,
						profilePic:this.avatar,
						description:this.desc
					}
					store.commit('user/updateAuth', userAuth)
				})

			},
			getUserData(){
				get({url:"/user"}).then((res)=>{

					this.username = res.data.username;
					this.desc = res.data.description;
					this.avatar = res.data.profilePicUrl;
				})

			},
			handlerExit(){
				store.commit('user/clearAuth')
				uni.reLaunch({
					url:'/pages/LoginPage/LoginPage'
				})
			},
		},
		computed:{
			
		}
	}
	
</script>

<style lang="scss">
	@import'../../common/common.scss';
	.avatar-box{
		width: 100%;
		text-align: center;
		position: relative;
		
		.avatar{
			width: 80px;
			height: 80px;
			border-radius: 50%;
			margin: 10px auto;
		}
	}

	.form-item textarea{
		max-height: 100px;
	}
	.btns-box{
		margin: 10px;
		.btn-save{
			margin-bottom: 10px;
			background-color: $theme-color;
			color: $bg-color-white;
		}
	}

	.form-item{
		display: flex;
		align-items: flex-start;
		margin: 15px;
		
		text{
			width: 20%;
		}
		input, textarea{
			flex: 1;
			border-bottom: 1px solid $btn-border-color;
		}
	}
	

</style>
