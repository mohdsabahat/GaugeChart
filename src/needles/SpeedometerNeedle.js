import Needle from './Needle';

class SpeedometerNeedle extends Needle {
    draw(angleRadians) {
        const lineLength = this.options.radius;
        const baseWidth = this.options.needle.needleWidth * 2;
        const endX = this.centerX + lineLength * Math.cos(angleRadians);
        const endY = this.centerY + lineLength * Math.sin(angleRadians);
        const baseX1 = this.centerX + baseWidth * Math.cos(angleRadians + Math.PI / 2);
        const baseY1 = this.centerY + baseWidth * Math.sin(angleRadians + Math.PI / 2);
        const baseX2 = this.centerX + baseWidth * Math.cos(angleRadians - Math.PI / 2);
        const baseY2 = this.centerY + baseWidth * Math.sin(angleRadians - Math.PI / 2);

        // Draw the needle
        this.context.beginPath();
        this.context.moveTo(baseX1, baseY1);
        this.context.lineTo(endX, endY);
        this.context.lineTo(baseX2, baseY2);
        this.context.closePath();
        this.context.fillStyle = this.options.needle.needleColor;
        this.context.fill();
        this.context.strokeStyle = '#000';
        this.context.lineWidth = 1;
        this.context.stroke();

        // Draw semicircle at the base
        this.context.beginPath();
        this.context.arc(this.centerX, this.centerY, baseWidth * 4, Math.PI, 2 * Math.PI);
        this.context.fillStyle = this.options.needle.needleColor;
        this.context.fill();
        this.context.strokeStyle = '#000';
        this.context.lineWidth = 1;
        this.context.stroke();
    }
}

export default SpeedometerNeedle;