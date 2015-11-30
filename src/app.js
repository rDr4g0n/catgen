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
