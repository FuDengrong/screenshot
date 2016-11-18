/**
 * Created by drfu on 6/15/16.
 */
(function (root, factory) {
    var core = factory(root);
    if (typeof define === 'function' && define.amd) {
        // AMD
        // define([], factory);
        define('core', function () {
            return core;
        });
    } else if (typeof exports === 'object') {
        // Node.js
        module.exports = core;
    } else {
        // Browser globals
        root.core = core;
    }
})(this, function () {
    $.fn.screenshot = function (targetID, previewBoxID, save) {
        $(window).resize(calcWH);
        var w, h, canvas, ctx, self = this, shotCanvas;
        function calcWH() {
            w = self.width();
            h = self.height();
            createCanvas();
        }
        calcWH();
        function createCanvas() {
            self.css({position: "relative"});
            self.append(
                $('<canvas id="shot-canvas"></canvas>').css({position: "absolute", left: "0", top: "0", zIndex: "99"})
            );
            shotCanvas = self.find("canvas#shot-canvas");
            canvas = shotCanvas.get(0);
            canvas.width = w;
            canvas.height = h;
            ctx = canvas.getContext('2d');
            shotCanvas.on("mousedown", down).on("mouseup", up);
        }

        var pos = {
            x: 0,
            y: 0,
            _x: 0,
            _y: 0
        };

        function move(e) {
            var ev = e || window.event,
                rectangleW = Math.abs(ev.offsetX - pos.x),
                rectangleH = Math.abs(ev.offsetY - pos.y);
            /**
             * 绘制目标路径
             */
            if(ev.offsetX > pos.x || ev.offsetY > pos.y) {
                ctx.clearRect(0, 0, w, h);
                ctx.save();
                ctx.beginPath();
                ctx.strokeStyle = '#0000ff';
                ctx.strokeRect( pos.x,  pos.y, rectangleW, rectangleH);
                ctx.restore();
            }else {
                /**
                 * 反向绘制
                 */
                ctx.clearRect(0, 0, w, h);
                ctx.beginPath();
                ctx.moveTo(pos.x, pos.y);
                ctx.lineTo(pos.x - rectangleW, pos.y);
                ctx.lineTo(ev.offsetX, ev.offsetY);
                ctx.lineTo(pos.x, pos.y - rectangleH);
                ctx.lineTo(pos.x, pos.y);
                ctx.strokeStyle = '#0000ff';
                ctx.stroke();
            }
        }

        function  down(e) {
            var ev = e || window.event;
            pos.x = ev.offsetX;
            pos.y = ev.offsetY;
            shotCanvas.on("mousemove", move);
        }

        function up(e) {
            shotCanvas.unbind("mousemove");
            var ev = e || window.event;
            pos._x = ev.offsetX;
            pos._y = ev.offsetY;

            var drawWidth = Math.abs(pos._x - pos.x),
                drawHeight = Math.abs(pos._y - pos.y),
                startX = pos.x,
                startY = pos.y;

            if(startX > pos._x || startY > pos._y) {
                startX = pos._x;
                startY = pos._y;
            }

            if(drawWidth > 10 && drawHeight > 10) {
                var pic = $(targetID).get(0);
                if(previewBoxID && previewBoxID !== "" && typeof previewBoxID == 'string') {
                    $(previewBoxID).find("canvas#pre-canvas").remove();
                    /**
                     * 创建预览canvas
                     * @type {Element}
                     */
                    var preCanvas = document.createElement("canvas");
                    preCanvas.setAttribute("id", "pre-canvas");
                    preCanvas.width = 100;
                    preCanvas.height = (drawHeight / drawWidth) * 100;
                    var _ctx = preCanvas.getContext('2d');
                    _ctx.clearRect(0, 0, preCanvas.width, preCanvas.height);
                    _ctx.drawImage(pic, startX, startY, drawWidth, drawHeight, 0, 0, preCanvas.width, preCanvas.height);
                    $(previewBoxID).append(preCanvas);
                }

                /**
                 * 清除绘制框
                 */
                setTimeout(function() {
                    ctx.clearRect(0, 0, w, h);
                }, 300);
                /**
                 * 是否保存
                 */
                if(save || save === "true") {
                    var saveCanvas = document.createElement("canvas");
                    saveCanvas.setAttribute("id", "pre-canvas");
                    saveCanvas.width = drawWidth;
                    saveCanvas.height = drawHeight;
                    var saveCtx = saveCanvas.getContext('2d');
                    saveCtx.clearRect(0, 0, saveCanvas.width, saveCanvas.height);
                    saveCtx.drawImage(pic, startX, startY, drawWidth, drawHeight, 0, 0, saveCanvas.width, saveCanvas.height);
                    saveImage(saveCanvas, 'screen_' + new Date().getTime() + '.png');
                }
            }
        }

        function saveImage (canvas, name) {
            var img = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
            $(".img").append($("#showimg").attr("backgroundImage", 'url(' + canvas.toDataURL() + ')'));
            saveFile(img, name || 'file_' + new Date().getTime() + '.png');
        }

        function saveFile(img, name) {
            var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
            save_link.href = img;
            save_link.download = name;
            var event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            save_link.dispatchEvent(event);
        }

        /**
         * 获取图片原始大小
         * @param tar
         * @param callback
         * @returns {{w: *, h: *}}
         */
        function getImgNaturalDimensions(tar, callback) {
            var nWidth, nHeight;
            if (tar.naturalWidth) {
                nWidth = tar.naturalWidth;
                nHeight = tar.naturalHeight
            } else { // IE6/7/8
                var image = new Image();
                image.src = tar.src;
                nWidth = image.width;
                nHeight = image.height;
            }
            return {
                w: nWidth,
                h: nHeight
            }
        }

        /**
         * 获取当前样式
         * @param tar
         * @param name
         * @returns {*}
         */
        function getStyle(tar, name) {
            if(window.getComputedStyle) {
                return window.getComputedStyle(tar, null);
            }else{
                return tar.currentStyle;
            }
        }
    };
});
