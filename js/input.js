console.log("input.js loaded");

class InputHandler {
    constructor(){
        this.tapped = false;

        // نستمع لحدث بدء اللمس (للهواتف) أو ضغط زر الفأرة (للحاسوب)
        window.addEventListener('touchstart', e => {
            this.tapped = true;
        });
        window.addEventListener('mousedown', e => {
            this.tapped = true;
        });

        // نستمع لحدث انتهاء اللمس أو رفع زر الفأرة
        // هذا مهم لمنع القفز المستمر إذا استمر اللاعب بالضغط
        window.addEventListener('touchend', e => {
            this.tapped = false;
        });
        window.addEventListener('mouseup', e => {
            this.tapped = false;
        });
    }
}