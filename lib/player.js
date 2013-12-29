var player = {
	target: '',
	leader: '',
	name: '',
	level: 0,
	xpNeeded: 0,
	xpStart: 0,
	xpTotal: [0, 0],
	tpNeeded: 0,
	tpStart: 0,
	tpTotal: 0
};

exports.getPlayer = function() {
    return player;
};

exports.get = function(key) {
	return player[key];
}

exports.set = function(key, value) {
	if (key === 'xpTotal') {
		player[key][0] = player[key][1];
		player[key][1] = value;
	} else {
		player[key] = value;
	}
}
