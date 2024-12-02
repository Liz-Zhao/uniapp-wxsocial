import {createStore} from 'vuex';
import user from '/store/modules/user.js'
import post from '/store/modules/post.js'
import setting from '/store/modules/setting.js'

const store = createStore({
	
	modules:{
		user,
		post,
		setting,
	}
})
export default store;