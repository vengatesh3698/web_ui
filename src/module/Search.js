import config from '@/router/config.json';
import axios from 'axios';
export var search=(payload)=>{
	return axios.post(config.host + 'search', payload).then(response => {
		var num = 1;
		response.data.rows.map((items, index) => {
			items.id = num++;
			return items
		});
		return response.data
	});
};