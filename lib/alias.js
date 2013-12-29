var path = require('path'),
    fs = require('fs'),
    player = require('./player'),
    file = 'config/aliases.json',
    aliases;

fs.exists(file, function(exists) {
    if (exists) {
        aliases = JSON.parse(fs.readFileSync(file, 'utf8'))
    } else {
        fs.writeFileSync(file, '{}', 'utf8')
        aliases = JSON.parse(fs.readFileSync(file, 'utf8'))
    }
});

exports.list = function() {
    return aliases;
}

exports.create = function(alias, callback) {
    var string = alias.replace(';alias add ', ''),
        array = string.match(/\{(?:[^\\}]+|\\.)*}/g),
        key = array[0].replace('{', '').replace('}', ''),
        value = array[1].replace('{', '').replace('}', '');

    aliases[key] = value

    fs.writeFile(file, JSON.stringify(aliases), function(err) {});
}

exports.remove = function(alias, callback) {
    var string = alias.replace(';alias rm ', ''),
        array = string.match(/\{(?:[^\\}]+|\\.)*}/g),
        alias,
        len,
        i;

    for (i = 0, len = array.lenght; i < len; i++) {
        alias = array[i].replace('{', '').replace('}', '');

        if (aliases[alias]) {
            delete aliases[alias];
            break;
        }
    }

    fs.writeFile(file, JSON.stringify(aliases), function(err) {})
}

exports.format = function(data) {
    for (var alias in aliases) {
        if (aliases.hasOwnProperty(alias)) {
            if (data === alias) {
                data = data.replace(alias, aliases[alias]);

                if (data.indexOf('__target') > -1) {
                    data = data.replace('__target', player.get('target'));
                }
            }
        }
    }

    return data;
}
