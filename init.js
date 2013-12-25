'use strict';

var fs = require('fs'),
    net = require('net'),
    http = require('http'),
    express = require('express'),
    alias = require('./lib/alias'),
    player = require('./lib/player'),
    trigger = require('./lib/trigger'),
    formatter = require('./lib/formatter'),
    config = JSON.parse(fs.readFileSync('config/config.json', 'utf8')),
    app = express(),
    server = http.createServer(app),
    io = require('socket.io').listen(server),
    mud = null;

function createResponse(command, data) {
    return {
        command: command,
        data: data
    };
}

function log(string) {
    console.log('[ muddy ][' + string + ']');
}

app.configure(function() {
    app.set('views', __dirname + '/views');
    app.use(express.static(__dirname + '/public'));
});

app.get('/', function(req, res) {
    res.render('index.ejs', {
        layout: false,
        locals: {
            mud: config.name
        }
    });
});

io.sockets.on('connection', function(socket) {
    socket.on('message', function(data) {
        var delimiter = ';',
            replaced,
            values;

        if (data[0] === delimiter) {
            if (data.match(/^;tar/i)) {
                player.set('target', data.replace(';tar ', ''));
                socket.emit('message', createResponse('updatePlayer', {
                    key: 'target',
                    player: player.getPlayer()
                }));
            } else if (data.match(/^;lead/i)) {
                player.set('leader', data.replace(';lead ', ''));
                socket.emit('message', createResponse('updatePlayer', {
                    key: 'leader',
                    player: player.getPlayer()
                }));
            } else if (data.match(/^;alias add/i)) {
                alias.create(data);
            } else if (data.match(/^;alias ls/i)) {
                socket.emit('message', createResponse('listAliases', alias.list()));
            } else if (data.match(/^;alias rm/i)) {
                alias.remove(data);
            } else if (data.match(/^;trigger add/i)) {
                trigger.create(data);
            } else if (data.match(/^;trigger ls/i)) {
                socket.emit('message', createResponse('listTriggers', trigger.list()));
            } else if (data.match(/^;trigger rm/i)) {
                trigger.remove(data);
            } else if (data.match(/^;zap/i)) {
                if (mud) {
                    mud.end();
                }
            } else if (data.match(/^;connect/i)) {
                mud = connectToMud(socket);
            } else if (data.match(/^;name/i)) {
                player.set('name', data.replace(';name ', ''));
            }
        } else {
            if (mud) {
                replaced = alias.format(data);
                if (replaced !== data) {
                    socket.emit('message', createResponse('echoAlias', replaced));
                }

                mud.write(replaced + '\r\n');
            }
        }
    });
});

function connectToMud(socket) {
    var mud = net.createConnection(config.port, config.host),
        index,
        length;

    mud.setEncoding('utf8');
    log(socket.id + ' connected to ' + config.host + ':' + config.port);

    mud.addListener('data', function(data) {
        var commands  = trigger.scan(data),
            formatted = formatter.go(data),
            values;

        if (data.indexOf('__status') > -1) {
            //,status: ,10, ,Sadaauk, ,417249, ,87751, ,7366, ,0,
            values = data.split('__');
            player.set('level', values[2]);
            player.set('name', values[4]);
            player.set('xpTotal', values[6]);
            player.set('xpNeeded', values[8]);
            player.set('tpTotal', values[10]);
            player.set('tpNeeded', values[12]);
            socket.emit('message', createResponse('updatePlayer', {
                key: 'all',
                player: player.getPlayer()
            }));
        } else {
            socket.emit('message', createResponse('updateWorld', formatted));

            if (commands) {
                for (index = 0, length = commands.length; index < length; index++) {
                    mud.write(commands[index]);
                }
            }
        }
    });

    mud.addListener('end', function(data) {
        log(socket.id + ' closed');
        socket.emit('message', createResponse('systemMessage', 'Disconnected.'));
    });

    return mud;
}

server.listen(6660);
