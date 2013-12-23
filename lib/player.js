var player = {
	target: '',
	leader: ''
};

exports.getPlayer= function() {
    return player;
}

exports.setTarget = function(data) {
    player.target = data.replace(';tar ', '');
}

exports.setLeader = function(data) {
    player.leader = data.replace(';lead ', '');
}

exports.getTarget = function() {
	return player.target;
}

exports.getLeader = function() {
	return player.leader;
}