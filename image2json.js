$(function(){
    // helper function to trigger when next frame available to render
    window.requestAnimFrame = (function(){
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function( callback ){ window.setTimeout(callback, 1000 / 60); };
    })();

    // JSON schema

    // set up display and output canvas's
    var canvas = document.getElementById("imgCanvas");
    var ctx = canvas.getContext("2d");

    // size variables
    var imgWidth = canvas.width;
    var imgHeight = canvas.height;
    var pixelSize = 10;

    var json, parsed, dataArray;
    var jsonUrl = "ben-test.json";

    // single pixel object
    var animationPixel = function(){
        this.startX = 0;
        this.startY = 0;
        this.endX = 0;
        this.endY = 0;
        this.currentX = 0;
        this.currentY = -pixelSize;
        this.color = "#000000";
    }

    // pixel array
    var pixels = [];

    // animation variables
    var speed = 10;

    function loadJson(){
        console.log( "loading" );

        json = $.getJSON( jsonUrl, function() {

            console.log( "success" );

        }).done(function() {
            console.log( "done" );


            jsonString = JSON.stringify(json);
            jsonObj = JSON.parse(jsonString);



            jsonArray = $.map(jsonObj.responseJSON ,function(value){
                return value;
            })

            console.log(jsonArray);

            // create pixel array
            createObjArray(jsonArray);

        }).fail(function(jqxhr, textStatus, error ) {

            var err = textStatus + ", " + error;
            console.log( "Request Failed: " + err );

        });
    }
    // trigger load json
    loadJson();

    // create pixel array
    function createObjArray(jsonArray){

        y = 0;
        while (jsonArray[y]) {

            x = 0;
            while (jsonArray[y][x]) {

                var pixel = new animationPixel;

                // move pxiel start to correct column
                pixel.startX =  x*pixelSize;
                pixel.currentX =  x*pixelSize;

                // set pixel end destination
                pixel.endX =  x*pixelSize;
                pixel.endY =  y*pixelSize;
                pixel.color = jsonArray[y][x];

                // add pixel to pixels array
                pixels.push(pixel);

                x++;
            }
            y++;
        }
        console.log(pixels);

        canvas.width = x*pixelSize;
        canvas.height = y*pixelSize;

        // start animation
        animloop();
    }


    // animation loop
    var dt;
    var lastUpdate = Date.now();
    var newMove = true;
    function animloop(){
        var now = Date.now();
        dt = now - lastUpdate;
        lastUpdate = now;

        requestAnimFrame(animloop);

        if(newMove){
            moveRandomPixel();
        }

        render();
    };



    function easeInQuad (t, b, c, d){
        t /= d;
        t--;
        return -c * (t*t*t*t - 1) + b;
    }

    var currentPixel = 0;
    var rand = 0;
    var iteration = 0
    function moveRandomPixel(){

        // run again if pixel at end
        if(pixels[rand].currentY >= pixels[rand].endY){

            // get random pixel
            rand = Math.floor(Math.random()*pixels.length);

            moveRandomPixel();
        }
        console.log(dt);

        // pixels[rand].currentY += easeInQuad(dt, speed, pixels[rand].endY, 1000);

        // move in the X
        if(pixels[rand].currentX < pixels[rand].endX){

            pixels[rand].currentX += speed;

        }else if(pixels[rand].currentX > pixels[rand].endX){

            pixels[rand].currentX -= speed;

        }
        // // move in the y
        if(pixels[rand].currentY < pixels[rand].endY){

            pixels[rand].currentY += speed;

        }else if(pixels[rand].currentY > pixels[rand].endY){

            pixels[rand].currentY -= speed;

        }
    }


    function render(){
        // clear screen
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, imgWidth, imgHeight);

        for (var i = 0; i < pixels.length; i++) {

            ctx.fillStyle = pixels[i].color;
            ctx.fillRect(pixels[i].currentX, pixels[i].currentY, pixelSize, pixelSize);

        }
    }

});
