/* jshint esnext: true */
(function(){
    "use strict";

    var template = Handlebars.compile(`
        {{#if message}}
        <div class="modal">
            <div class="message">{{{message}}}</div> 
            <div class="close">❌</div>
        </div>
        {{/if}}

        <canvas class="portrait" width="360" height="180"></canvas>

        <div class="greeting">{{model.greeting}}</div>

        {{#if isNew}}
        <input type="text" class="name-input" placeholder="meow!">
        <div class="actions">
            <div class="no btn">✖ No me gusta</div>
            <div class="yes btn">✓ I like this one</div>
        </div>

        {{else}}
        <div class="name">{{model.name}}</div>
        {{#if isAlive}}
        <div class="share">
            <input class="share-link" value="http://localhost:3006/api/cats/{{model.id}}" readonly onclick="this.select();">
            <i class="share-icon">★</i>
        </div>
        {{/if}}
        {{/if}}
    `);

    var ALIVE = "alive",
        DEAD = "dead",
        NEW = "new";


    var sassycat = {
        "nameme": [
            "Hi! Will you name me?"
        ],
        "missingName": [
            "I need a name buddy",
            "Cmon, gimme a name",
            "You can't just call me undefined"
        ],
        "dead": [
            "I can change, I swear!",
            "It's not you, its meeeeeee",
            "This actually hurts ya know",
            "MMEEE  OOOOWWW!",
            "I'll find you",
            "ugh. Mondays."
        ],
        "alive": [
            "Hey, my name is",
            "My mom calls me",
            "My name is ‱̧͂͐̎̈ͤ̂͊̿̎ͤ͂ͮͫ͢҉̶҉͓̗͙͕̻͖̖, but you can call me"
        ]
    };

    function getSassyText(CATegory){
        var strings = sassycat[CATegory];
        return strings[Math.floor(Math.random()*strings.length)];
    }

    class CatCard {

        constructor(cat){
            this.el = document.createElement("div");
            this.el.className = "cat-card";

            if(cat){
                this.model = cat;
                this.status = ALIVE;
            } else {
                this.model = {
                    greeting: getSassyText("nameme")
                };
                this.status = NEW;
            }

            // give event emitter powers
            eventEmitter.call(this);

            // start listening for model changes
            Object.observe(this.model, function(changes){
                this.render();
            }.bind(this));

            this.attachListeners();
            this.render();
        }

        attachListeners(){
            // probably not the most sensible arrangement
            var listeners = {
                ".btn.yes": this.save,
                ".btn.no": this.murder,
                ".modal .close": this.hideMessage
            };

            var clickHandler = e => {
                var target = e.target;
                for(var listener in listeners){
                    if(target.matches(listener)){
                        listeners[listener].call(this, e);
                    }
                }
            };
            this.el.addEventListener("click", clickHandler);

            // TODO - probably not the nicests
            this.removeEventListeners = () => {
                this.el.removeEventListener("click", clickHandler);
            };
        }

        render(){
            // TODO - use getters or something for these props
            this.isNew = this.checkIsNew();
            this.isAlive = this.checkIsAlive();
            this.el.innerHTML = template(this);
        }

        checkIsNew(){
            return this.status === NEW;
        }
        checkIsAlive(){
            return this.status === ALIVE;
        }

        save(){
            var name = this.el.querySelector(".name-input").value;

            if(!name){
                // disable client side verification
                //this.model.greeting = getSassyText("missingName");
                //return;
            }

            this.status = ALIVE;
            this.model.name = name;
            this.model.greeting = getSassyText("alive");

            this.emit("saved", this);
        }

        murder(){
            this.status = DEAD;
            this.model.name = ":(";
            this.model.greeting = getSassyText("dead");

            this.emit("murdered", this);
        }

        // clean up for GC
        destroy(){
            this.removeEventListeners();
            this.off();
        }

        // keep cat portrait, but mark as new
        reset(){
            this.status = NEW;
            this.model.name = "";
            this.model.greeting = getSassyText("nameme");
        }

        // shows a little modal message inside
        // cat card
        showMessage(message){
            this.message = message;
            this.render();
        }
        hideMessage(){
            this.message = "";
            this.render();
        }
    }

    window.CatCard = CatCard;
}());
