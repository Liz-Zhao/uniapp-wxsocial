import { get } from "../../api/request";

export default {
	namespaced: true, // 启用命名空间
	state: {
		// object 对象：_id,username,token,openid,updatedAt ,createdAt, description
		userAuth: uni.getStorageSync('userAuth') || '',
		
	},
	getters: {
		userAuth(state){
			return state.userAuth
		},
		token(state){
			return state.userAuth && state.userAuth.token;
		},
		user_id(state){
			return state.userAuth && state.userAuth._id;
		},
		username(state){
			return state.userAuth && state.userAuth.username;
		},
		desc(state){
			return state.userAuth && state.userAuth.description;
		},
		avatar(state){
			return state.userAuth && state.userAuth.profilePic;
		},
		profilePicUrl(state){
			return state.userAuth && state.userAuth.profilePicUrl;
		},
	},
	mutations: {
		updateAuth(state, userAuth){
			state.userAuth = userAuth
			this.commit('user/saveUserAuthStorage')
		},
		
		saveUserAuthStorage(state){
			uni.setStorageSync('userAuth',state.userAuth)
		},
		clearAuth(state){
			state.userAuth = ''
			this.commit('user/removeUserAuthStorage')
		},
		
		removeUserAuthStorage(state){
			uni.removeStorageSync('userAuth')
		},
		
	},
	actions: {

	}
}
