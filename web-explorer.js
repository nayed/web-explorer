#!/usr/bin/env node
"use strict"

let path = require('path')
let express = require('express')
let contentDisposition = require('content-disposition')
let pkg = require(path.join(__dirname, 'package.json'))
let scan = require('./scan')

// Parse command line options
let program = require('commander')

program
        .version(pkg.version)
        .option('-p, --port <port>', 'Port on which to listen to (defaults to 3000', parseInt)
        .parse(process.argv)

let port = program.port || 3000

/* Scan the directory in which the script was called.
*  It will add the 'files/' prefix to all files and folders, so that
*  download links point to our /files route
*/
let tree = scan('.', 'files')


// Create a new express app
let app = express()


// Serve static files from the frontend folder
app.use('/', express.static(path.join(__dirname, 'frontend')))


// Serve files from the current directory under the /files route
app.use('/files', express.static(process.cwd(), {
    index: false,
    setHeaders: function(res, path) {
        // Set header to force files to download
        res.setHeader('Content-Disposition', contentDisposition(path))
    }
}))


// This endpoint is requested by our frontend JS
app.get('/scan', function(req, res) {
    res.send(tree)
})

// Everything is setup. Listen on the port
app.listen(port)

console.log('web explorer is running on port ' + port)