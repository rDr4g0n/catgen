var http = require("http"),
	url = require("url"),
	path = require("path"),
	fs = require("fs");


var catcards = {
    cards: []
};

module.exports = function(dir, port){
    port = port || 3006;
    dir = dir ? path.join(process.cwd(), dir) : process.cwd();

    http.createServer(function(req, res){
        var uri = url.parse(req.url).pathname,
            filename = path.join(dir, uri);

        // roll your own RESTy api, wheee
        if(uri.substr(0, 4) === "/api"){
            handleAPIRequest(req, res);
            return;
        }

        path.exists(filename, function(exists){
            if(!exists){
                res.writeHead(404, {"Content-Type": "text/plain"});
                res.write("404 Not Found\n");
                res.end();
                return;
            }

            if(fs.statSync(filename).isDirectory()){
                filename += "index.html";
            }

            fs.readFile(filename, "binary", function(err, file){
                if(err){
                    res.writeHead(500, {"Content-Type": "text/plain"});
                    res.write(err + "\n");
                    res.end();
                    return;
                }

                res.setHeader("Content-Type", getContentType(filename));
                res.writeHead(200);
                res.write(file, "binary");
                res.end();
            });
        });
    }).listen(parseInt(port, 10));

    console.log("Serving directory", dir, "on port", port);
};

function getContentType(fileName) {
    var ext = fileName.slice(fileName.lastIndexOf('.')),
        type;

    switch (ext) {
        case ".html":
            type = "text/html";
            break;

        case ".js":
            type = "text/javascript";
            break;

        case ".css":
            type = "text/css";
            break;

        default:
            type = "text/plain";
            break;
    }

    return type;
}

function handleAPIRequest(req, res){

    var method = req.method,
        parsed = url.parse(req.url),
        path = parsed.pathname.split("/").slice(2);

    var body="";

    console.log(method + "ing", path);

    if(path[0] === "cats"){
        if(method === "GET"){
            res.setHeader("Content-Type", "application/json");
            res.writeHead(200);
            res.write(JSON.stringify(catcards));
            res.end();
        }
        if(method === "POST"){
            req.on("data", function(data){
                body += data;
            });
            req.on("end", function(){
                if(!body){
                    res.writeHead(400, {"Content-Type": "text/plain"});
                    res.write("Missing cat info");
                    res.end();
                    return;
                }

                var catcard = JSON.parse(body);

                if(!catcard.name){
                    res.writeHead(400, {"Content-Type": "text/plain"});
                    res.write("Missing cat name. How can you have a cat without a name?");
                    res.end();
                    return;
                }

                catcard.id = "C"+Math.floor(Math.random()*1000000);
                catcards.cards.push(catcard);
                res.setHeader("Content-Type", "application/json");
                res.writeHead(200);
                res.write(JSON.stringify(catcard));
                res.end();
            });
        }
    } else {
        res.writeHead(404, {"Content-Type": "text/plain"});
        res.write("404 Not Found\nCould not find '"+ path[0] +"'");
        res.end();
    }
}
