/* jshint esnext: true */
(function(){
    // vanilla-ish xhr stuff
    // TODO - move to a file or something
    function GET(url){
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.send();
        return waitForResponse(xhr);
    }
    function POST(url, data){
        if(typeof data !== "string"){
            data = JSON.stringify(data);
        }
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.send(data);
        return waitForResponse(xhr);
    }
    function waitForResponse(xhr){
        var deferred = Q.defer();
        xhr.onreadystatechange = function () {
            var DONE = 4; // readyState 4 means the request is done.
            var OK = 200; // status 200 is a successful return.
            if (xhr.readyState === DONE) {
                if (xhr.status === OK) {
                    deferred.resolve(xhr.responseText);
                } else {
                    deferred.reject(xhr.status);
                }
            }
        };

        return deferred.promise;
    }   
    window.xhr = {
        GET: GET,
        POST: POST
    };



    // TODO - use template to keep cat card list up to date
    getCatCards().then(catcards => {
        catcards.cards.forEach(model => {
            createCatCard(model);
        });
        createCatCard(); 
    });

    function saveCatCard(catcard){
        xhr.POST("/api/cats", catcard.model).then(res => {
            // TODO - update view
            createCatCard();
        })
        .catch(err => {
            // changes didnt stick, so 
            // reset the cat
            catcard.reset();
            catcard.showMessage("<div style='font-size: 3em;'>❇</div><b>Cat Error: error with cat.</b><br> What you do?");
        });
    }

    function getCatCards(){
        // TODO - handle failure
        return xhr.GET("/api/cats").then(catcards => JSON.parse(catcards));
    }

    function createCatCard(model){
        var catCard = new window.CatCard(model),
            cardsEl = document.querySelector(".cards");

        cardsEl.insertBefore(catCard.el, cardsEl.firstChild);

        catCard.on("murdered", function(){
            // give enough time to see a 
            // glimpse of the terror
            setTimeout(function(){
                catCard.el.remove();
                catCard.destroy();
                createCatCard();
            }, 500);
        });

        catCard.on("saved", saveCatCard);

        return catCard;
    }


})();
