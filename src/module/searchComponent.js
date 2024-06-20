export var search = function(term, input){
	if (!term || term.length < 1) return input;
	return input.filter(function(item) {
		var flag = false
		for (var i in item) {
			if (item[i] != null) {
				if ((item[i].toString().toLowerCase().includes(term.toLowerCase()))) {
					flag = true
					return flag
				};
				if (Array.isArray(item[i])) {
					item[i].filter(function (data) {
						for (var j in data) {
							if (data[j] != null) {
								if ((data[j].toString().toLowerCase().includes(term.toLowerCase()))) {
									flag = true;
									return flag;
								};
							};
						};
					});
				};
			};
		};
		return flag;
	});
};
