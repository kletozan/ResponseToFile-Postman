
const express = require('express'),
    app = express(),
    fs = require('fs'),
    path = require('path'),
    shell = require('shelljs'),
    dateFormat = require("dateformat"),
    bodyParser = require('body-parser'),
    byteSize = require('byte-size'),
    homedir = require('os').homedir(),
    folderPath = path.join(homedir, 'Postman', 'files');
    defaultFileExtension = 'txt',
    FS_DEFAULT_MODE = 'writeFile',
    DATE_FORMAT ='[yyyy-mm-dd HH:MM:ss]';

shell.mkdir('-p', folderPath);

app.get('/', (req, res) => res.send('Hello, I write data to file. Send them requests!'));

app.get('/read/:filename', (req, res) => {
    filePath = `${path.join(folderPath, req.params.filename)}`;
    const content = fs.readFileSync(filePath);
    res.send(content);
});

app.post('/write', bodyParser.json({limit: '1mb'}), (req, res) => {
    let extension = req.body.fileExtension || defaultFileExtension,
    fsMode = req.body.mode || FS_DEFAULT_MODE,
    filename = req.body.uniqueIdentifier ? typeof req.body.uniqueIdentifier === 'boolean' ? Date.now() : req.body.uniqueIdentifier : false,
    filePath = `${path.join(folderPath, filename)}.${extension}`,
    options = req.body.options || undefined;

    var buffer = undefined;
    if (req.body.responseData.type == 'Buffer') {
        buffer = Buffer.from(req.body.responseData);
    } else {
        console.log(dateFormat(Date.now(), DATE_FORMAT) + ' ERROR Invalid responseData.type ' + req.body.responseData.type);
        res.send('Error');
        return;
    }

    fs[fsMode](filePath, buffer, options, (err) => {
        if (err) {
            console.log(err);
            res.send('Error');
        } else {
            var postmanToken = req.get('Postman-Token');
            if (postmanToken) {
                postmanTokenFormat = ' ' + postmanToken;
            }
            console.log(dateFormat(Date.now(), DATE_FORMAT) + ' FILE ' + filePath + postmanTokenFormat + ' (' + byteSize(buffer.length) + ')');
            res.send('Success');
        }
    });
});

var server = app.listen(3000, "localhost", () => {
    console.log(dateFormat(Date.now(), DATE_FORMAT) + 
        ' ResponsesToFile listening to http://' + server.address().address + ':' + server.address().port);
    console.log(dateFormat(Date.now(), DATE_FORMAT) + ' Files stored at ' + `${folderPath}`);
});
