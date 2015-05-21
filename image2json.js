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
    var pixelSize = 40;

    var json, parsed, dataArray;

    // single pixel object
    var animationPixel = function(){
        this.startX = 0;
        this.startY = 0;
        this.endX = 0;
        this.endY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.color = "#000000";
    }

    // pixel array
    var pixels = [];

    // animation variables
    var speed = 5;

    function loadJson(){
        json = '{"0": {"0":"#d7f3ff","1":"#d0eaf7","2":"#d3ebf7","3":"#d5ebf6","4":"#d2e5e1"},"1": {"0":"#d5f1fd","1":"#dcf4ff","2":"#b7e5f4","3":"#b5f1f9","4":"#cee1e8"},"2": {"0":"#d7f1fe","1":"#b2f1fa","2":"#c3f5fc","3":"#2b2e59","4":"#cae2e6"},"3": {"0":"#d2ecfb","1":"#a8ecf7","2":"#b1effc","3":"#d5cac6","4":"#d2e9f7"},"4": {"0":"#cadffe","1":"#76dbf7","2":"#80d1ee","3":"#96b6f1","4":"#afb8c1"}}';

        parsed = JSON.parse(json);
        console.log(parsed);
    }

    loadJson();

    function createObjArray(){
        y = 0;
        while (parsed[y]) {
            x = 0;
            while (parsed[y][x]) {

                var pixel = new animationPixel;

                // move pxiel start to correct column
                pixel.startX =  x*pixelSize;
                pixel.currentX =  x*pixelSize;

                // set pixel end destination
                pixel.endX =  x*pixelSize;
                pixel.endY =  y*pixelSize;
                pixel.color = parsed[y][x];

                // add pixel to pixels array
                pixels.push(pixel);

                x++;
            }
            y++;
        }
    }
    createObjArray();

    console.log(pixels);

    // usage:
    // instead of setInterval(render, 16) ....

    function animloop(){
        requestAnimFrame(animloop);
        moveRandomPixel();
        render();
    };


    function moveRandomPixel(){
        rand = Math.floor(Math.random()*pixels.length);

        // run again if pixel at end
        if(pixels[rand].currentX == pixels[rand].endX && pixels[rand].currentY == pixels[rand].endY){
            moveRandomPixel();
        }

        // move in the X
        if(pixels[rand].currentX < pixels[rand].endX){

            pixels[rand].currentX += speed;

        }else if(pixels[rand].currentX > pixels[rand].endX){

            pixels[rand].currentX += speed;

        }
        // move in the y
        if(pixels[rand].currentY < pixels[rand].endY){

            pixels[rand].currentY += speed;

        }else if(pixels[rand].currentY > pixels[rand].endY){

            pixels[rand].currentY += speed;

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

    // start animation
    animloop();

});
