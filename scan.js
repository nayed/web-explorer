"use strict"

let fs = require('fs')

module.exports = function scan(dir, alias) {
    return {
        name: alias,
        type: 'folder',
        path: alias,
        items: walk(dir, alias)
    }
}

function walk(dir, prefix) {
    prefix = prefix || ''

    if (!fs.statSync(dir))
        return []

    return fs.readdirSync(dir).filter(function(f) {
        return f && f[0] != '.'     // ignore hidden files
    }).map(function(f) {
        let p = (dir + '/' + f).replace('./', '')
        let stat = fs.statSync(p)

        if (stat.isDirectory()) {
            return {
                name: f,
                type: 'folder',
                path: prefix + '/' + p,
                items: walk(p, prefix)
            }
        }

        return {
            name: f,
            type: 'file',
            path: prefix + '/' + p,
            size: stat.size
        }
    })
}