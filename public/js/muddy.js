$(function () {
    "use strict";

    var world = new World('#world'),
        socket = io.connect(window.location.hostname);

    function resizeUI() {
        $('#input input').width(window.innerWidth - 30);
        $('.world-container').height(window.innerHeight - 180);
        $('.world-output').attr({
            scrollTop: $('.world-output').attr('scrollHeight')
        });
        $('.comm-output').attr({
            scrollTop: $('.comm-output').attr('scrollHeight')
        });
    }

    resizeUI();

    socket.on('connect', function () {
        var connectButton = $('#connectButton');

        $('input').focus();

        $('input').keyup(function (event) {
            var message,
                KEYCODE_ENTER = 13,
                KEYCODE_ESC = 27,
                KEYCODE_UP = 38,
                KEYCODE_DOWN = 40,
                key = event.keyCode;

            switch (key) {
                case KEYCODE_ENTER:
                    message = $('input').val();
                    socket.emit('message', message);
                    world.selfMesssage(message);
                    world.updateHistory(message);
                    $('input').val('');
                break;
                case KEYCODE_UP:
                    if (world.history[world.current - 1]) {
                        $('input').val(world.history[world.current -= 1]);
                    }
                break;
                case KEYCODE_DOWN:
                    if (world.history[world.current]) {
                        $('input').val(world.history[world.current += 1]);
                    }
                break;
                case KEYCODE_ESC:
                    $('input').val('');
                break;
            }
        });

        connectButton.click(function (event) {
            console.log(event);
            if (connectButton.val() === 'connect') {
                socket.emit('message', ';connect');
                connectButton.val('zap');
                connectButton.html('Disconnect');
            } else {
                socket.emit('message', ';zap');
                connectButton.val('connect');
                connectButton.html('Connect');
            }
        });

        $('.output').click(function (event) {
            $('input').focus();
        });

        window.onresize = function(event) {
            resizeUI();
        };
    });

    socket.on('message', function(message) {
        var command = message.command,
            data = message.data;

        switch (command) {
            case 'systemMessage':
                world.systemMessage(data);
            break;
            case 'updateWorld':
                world.update(data);
            break;
            case 'listAliases':
                world.listAliases(data);
            break;
            case 'listTriggers':
                world.listTriggers(data);
            break;
        }
    });
});
