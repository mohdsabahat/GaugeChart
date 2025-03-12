class Needle {
    constructor(context, options, centerX, centerY) {
        this.context = context;
        this.options = options;
        this.centerX = centerX;
        this.centerY = centerY;
    }

    draw() {
        throw new Error('Method draw() must be implemented.');
    }
}

export default Needle;