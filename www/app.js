/* jshint esnext: true */
(function(){
    "use strict";

    var template = Handlebars.compile(`
        <canvas id="kitty" class="portrait" width="360" height="180"></canvas>

        <div class="greeting">{{model.greeting}}</div>

        {{#if isNew}}
        <input type="text" class="name-input" placeholder="meow!">
        <div class="actions">
            <div class="no btn">✖ No me gusta</div>
            <div class="yes btn">✓ I like dis one</div>
        </div>

        {{else}}
        <div class="name">{{model.name}}</div>
        {{#if isAlive}}
        <div class="share">
            <input class="share-link" value="catgen.com/?cat=JR12jDD8fsjdkfHAFjkdsf9808dfsdFJKAJ123f9jdikhja" readonly onclick="this.select();">
            <i class="share-icon">★</i>
        </div>
        {{/if}}
        {{/if}}
    `);

    var ALIVE = "alive",
        DEAD = "dead",
        NEW = "new";


    var sassycat = {
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
            this.el.className = "cat-card new";

            if(cat){
                this.model = cat;
                this.status = ALIVE;
            } else {
                this.model = {
                    greeting: "Hi! Will you name me?" 
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
                ".btn.no": this.murder
            };

            this.el.addEventListener("click", e => {
                var target = e.target;
                for(var listener in listeners){
                    if(target.matches(listener)){
                        listeners[listener].call(this, e);
                    }
                }
            });
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
                this.model.greeting = getSassyText("missingName");
                return;
            }

            this.status = ALIVE;
            this.model.name = name;
            this.model.greeting = getSassyText("alive");

            this.emit("saved", this.model);
        }

        murder(){
            this.status = DEAD;
            this.model.name = ":(";
            this.model.greeting = getSassyText("dead");

            this.emit("murdered", this.el);
        }

        destroy(){
            // TODO - unbind listeners
        }
    }

    window.CatCard = CatCard;
}());

(function(){

    /*
    var canvas = document.getElementById("kitty"),
        context = canvas.getContext("2d"),
        bounds = canvas.getBoundingClientRect(),
        w = bounds.width,
        h = bounds.height,
        centerW = bounds.width / 2,
        centerH = bounds.height / 2;

    var palette = {
        primary: "#171334",
        bg: "#6382B8",
        accent: "#F84F76"
    };
    */



    window.drawAThing = function(){
        // bg
        context.fillStyle = palette.bg;
        context.fillRect(0, 0, w, h);

        // head
        context.beginPath();
        context.arc(centerW, centerH, Math.min(centerW, centerH) - 40, 0, 2 * Math.PI, false);
        context.fillStyle = palette.primary;
        context.fill();
        context.closePath();

        // ears
        var x0 = centerW - 20,
            y0 = centerH - 45;

        context.beginPath();
        context.moveTo(x0, y0);
        context.lineTo(x0 - 50, y0 - 20);
        context.lineTo(x0 - 30, y0 + 50);
        context.fillStyle = palette.primary;
        context.fill();
        context.closePath();

        x0 = centerW + 20;
        y0 = centerH - 45;

        context.beginPath();
        context.moveTo(x0, y0);
        context.lineTo(x0 + 50, y0 - 20);
        context.lineTo(x0 + 30, y0 + 50);
        context.fillStyle = palette.primary;
        context.fill();
        context.closePath();

        // ojos
        var eyeWidth = 40,
            halfEyeWidth = eyeWidth / 2,
            eyeHeight = 70,
            halfEyeHeight = eyeHeight / 2,
            eyeSpacing = 30,
            eyeVerticalPosition = -20;

        x0 = centerW - eyeSpacing;
        y0 = centerH - eyeVerticalPosition;

        context.beginPath();
        context.moveTo(x0 - halfEyeWidth, y0);
        context.bezierCurveTo(x0 - halfEyeWidth, y0, x0, y0 + halfEyeHeight, x0 + halfEyeWidth, y0);
        context.bezierCurveTo(x0 + halfEyeWidth, y0, x0, y0 - halfEyeHeight, x0 - halfEyeWidth, y0);
        context.fillStyle = palette.accent;
        context.fill();
        context.closePath();

        x0 = centerW + eyeSpacing;
        y0 = centerH - eyeVerticalPosition;

        context.beginPath();
        context.moveTo(x0 - halfEyeWidth, y0);
        context.bezierCurveTo(x0 - halfEyeWidth, y0, x0, y0 + halfEyeHeight, x0 + halfEyeWidth, y0);
        context.bezierCurveTo(x0 + halfEyeWidth, y0, x0, y0 - halfEyeHeight, x0 - halfEyeWidth, y0);
        context.fillStyle = palette.accent;
        context.fill();
        context.closePath();
    };

    //drawAThing();
    

    // TODO - save and load catcards to ls
    var catCard = new window.CatCard();
    document.querySelector(".cards").appendChild(catCard.el);

    catCard.on("murdered", function(){
        // give enough time to see a 
        // glimpse of the terror
        setTimeout(function(){
            catCard.el.remove();
            catCard.destroy();

            // TODO - add a new one
        }, 500);
    });

    // TODO - on saved, add a new, empty catcard

})();

//# sourceMappingURL=app.js.map
