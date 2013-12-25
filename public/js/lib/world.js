var World = function(selector) {
    this.selector = selector;
    this.history = [];
    this.current = 0;
    this.target = $('#player #target');
    this.leader = $('#player #leader');
    this.name = $('#player #name');
    this.level = $('#player #level');
    this.xp = $('#session #xp');
    this.tp = $('#session #tp');
    this.xpSession = $('#session #xpSession');
    this.tpSession = $('#session #tpSession');
};

World.prototype.update = function(data) {
    $(this.selector).append(data);
    $(this.selector).attr({
        scrollTop: $(this.selector).attr('scrollHeight')
    });
};

World.prototype.selfMessage = function(message) {
    this.update("<span class='self'>" + message + "</span>\r\n");
};

World.prototype.systemMessage = function(message) {
    this.update("\r\n<span class='yellow'># " + message + "</span>\r\n");
};

World.prototype.updateHistory = function(command) {
    if (command !== '') {
        this.history.push(command);
        this.current = this.history.length;
    }
};

World.prototype.listAliases = function(aliases) {
    this.systemMessage('Your Aliases:\r\n');

    for (alias in aliases) {
        if (aliases.hasOwnProperty(alias)) {
            var key = alias,
                value = aliases[alias];

            this.systemMessage('type `' + key + '` to `' + value + '`');
        }
    }
};

World.prototype.listTriggers = function(triggers) {
    this.systemMessage('Your Triggers:\r\n');

    for (trigger in triggers) {
        if (triggers.hasOwnProperty(trigger)) {
            var key   = trigger,
                value = triggers[trigger];

            this.systemMessage('type `' + key + '` to `' + value + '`');
        }
    }
};

World.prototype.updatePlayer = function(data) {
    var key = data.key,
        player = data.player;

    if (key === 'all') {
        this.name.html('Name: ' + player.name);
        this.level.html('Level: ' + player.level);
        this.xp.html('XP Total (Needed): ' + player.xpTotal[player.xpTotal.length - 1] + ' (' + player.xpNeeded+ ')');
        this.tp.html('TP Total (Needed): ' + player.tpTotal[player.tpTotal.length - 1] + ' (' + player.tpNeeded + ')');

        if (player.xpTotal.length < 2) {
            this.xpSession.html('XP This Session: 0');
        } else {
            this.xpSession.html('XP This Session: ' + (player.xpTotal[player.xpTotal.length - 1] - player.xpTotal[0]));
        }

        if (player.tpTotal.length < 2) {
            this.tpSession.html('TP This Session: 0');
        } else {
            this.tpSession.html('TP This Session: ' + (player.tpTotal[player.tpTotal.length - 1] - player.tpTotal[0]));
        }
    }

    if (key === 'target') {
        this.systemMessage('Target set to: ' + player.target);
        this.target.html('Target: ' + player.target);
    }

    if (key === 'leader') {
        this.systemMessage('Leader set to: ' + player.leader);
        this.leader.html('Leader: ' + player.leader);
    }
};
