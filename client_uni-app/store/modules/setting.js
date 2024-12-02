export default{
	namespaced:true,
	state:{
		visible:false,
	},
	getters:{
		visible(state){
			return state.visible
		}
	},
	mutations:{
		showSetting(state){
			state.visible = true
		},
		hideSetting(state){
			state.visible = false
		}
	},
	actions:{
		
	}
}