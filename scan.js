let fs = require('fs')
let path = require('path')

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
        let p = path.join(dir, f)
        let stat = fs.statSync(p)

        if (stat.isDirectory()) {
            return {
                name: f,
                type: 'folder',
                path: path.join(prefix, p),
                items: walk(p, prefix)
            }
        }

        return {
            name: f,
            type: 'file',
            path: path.join(prefix, p),
            size: stat.size
        }
    })
}