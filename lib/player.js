var player = {
	target: '',
	leader: '',
	name: '',
	level: 0,
	xpNeeded: 0,
	xpTotal: [],
	tpNeeded: 0,
	tpTotal: []
};

exports.getPlayer = function() {
    return player;
};

exports.get = function(key) {
	return player[key];
}

exports.set = function(key, value) {
	if (key === 'xpTotal' || key === 'tpTotal') {
		player[key].push(value);
	} else {
		player[key] = value;
	}
}
