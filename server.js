var fs = require("fs");
var express = require("express");
var http = require("http");
var https = require("https");
var dateformat = require("dateformat");

var app = express();
var config = {};

var log = function(s) {
    var date = dateformat(new Date(), "yyyy-mm-dd HH:MM:ss.l");
    console.log("%s - %s", date, s);
};

var loadConfig = function() {
    var path = __dirname + "/config/config.json";
    log("Loading config from " + path);
    var s = fs.readFileSync(path);
    config = JSON.parse(s);
};

var getHttp = function() {
    if (config.protocol.toLowerCase() == "http") {
        return http;
    } else {
        return https;
    }
};

var setState = function(item, state) {
    log("Setting state for " + item + " to " + state);
    var req = getHttp().request({
        method: "PUT",
        host: config.host,
        port: config.port,
        path: config.path + "rest/items/" + item + "/state",
        headers: {
            "Content-Type": "text/plain"
        },
        auth: config.auth
    }, function(res) {
        log("Resulting HTTP Status Code = " + res.statusCode);
    });
    req.on("error", (e) => {
        log(e);
    });
    req.write(state);
    req.end();
};

var getHttpResult = function(cb, cbErr) {
    var buffer = "";
    var req = getHttp().request({
        method: "GET",
        host: config.host,
        port: config.port,
        path: config.path + "basicui/app",
        auth: config.auth
    }, function(res) {
        if (res.statusCode != 200) {
            cbErr();
            return;
        }
        res.on("data", function(data) {
            buffer += data;
        });
        res.on("end", function() {
            cb(buffer);
        });
    }).on("error", cbErr);
    req.end();
};

app.post("/enter", function(req, res) {
    setState(config.item, "ON");
    res.end();
});

app.post("/exit", function(req, res) {
    setState(config.item, "OFF");
    res.end();
});

app.get("/status", function(req, res) {
    getHttpResult(function(s) {
        if (s.indexOf(config.statusCheckString) > -1) {
            res.end("OK");
        } else {
            res.end("ERROR");
        }
    }, function() {
        res.end("ERROR");
    });
});

loadConfig();

app.listen(config.bridgePort, function() {
    log("openHAB Geofence Bridge listening on port " + config.bridgePort);
});
