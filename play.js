/**
 * Created by Array on 2016/5/12.
 */
window.onload = function() {
    var w, h, v = $(".cut");
    w = v.width();
    h = v.height();
    window.addEventListener("resize", resizeCanvas, false);
    function resizeCanvas() {
        w = v.width();
        h = v.height();
    }

    var canvas = document.getElementById("canvas");
    canvas.width = w;
    canvas.height = h;

    var ctx = canvas.getContext('2d');

    v.on("mousedown", down).on("mouseup", up);
    var pos = {
        x: 0,
        y: 0,
        _x: 0,
        _y: 0
    };
    function  down(e) {
        pos.x = e.offsetX;
        pos.y = e.offsetY;
    }

    function up(e) {
        pos._x = e.offsetX;
        pos._y = e.offsetY;
        console.log(pos.x, pos.y);
        console.log(pos._x, pos._y);

        if(Math.abs(pos.x - pos._x) > 10 && Math.abs(pos.y - pos._y)) {

            var img = document.getElementsByTagName("img")[0];

            //var image = new Image();
            //image.src = $("#old").attr("src");

            var sPos = getPointOnCanvas(canvas, pos.x, pos.y),
                ePos = getPointOnCanvas(canvas, pos._x, pos._y);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.save();
            /**********************/
            ctx.beginPath();
            ctx.rect(sPos.x, sPos.y, ePos.x, ePos.y);
            ctx.clip();
            /**********************/
            ctx.drawImage(img, 0, 0);
            ctx.restore();



            saveImage(canvas, 'screen_' + new Date().getTime() + '.png');

            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }



    function saveImage (canvas, filename) {
        var image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
        $(".img").append($("#showimg").attr("backgroundImage", 'url(' + image + ')'));
        saveFile(image, filename || 'file_' + new Date().getTime() + '.png');
    }

    function saveFile(data, filename) {
        var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
        save_link.href = data;
        save_link.download = filename;

        var event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        save_link.dispatchEvent(event);
    }


    function getPointOnCanvas(canvas, x, y) {

       var box = canvas.getBoundingClientRect();

       return { x: x - box.left *(canvas.width / box.width),

           y: y - box.top  * (canvas.height / box.height)

       };

    }

};