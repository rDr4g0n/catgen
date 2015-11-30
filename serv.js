var http = require("http"),
	url = require("url"),
	path = require("path"),
	fs = require("fs");

module.exports = function(dir, port){
    port = port || 3006;
    dir = dir ? path.join(process.cwd(), dir) : process.cwd();

    http.createServer(function(req, res){
        var uri = url.parse(req.url).pathname,
            filename = path.join(dir, uri);

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
