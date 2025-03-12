import Needle from './Needle';

class DefaultNeedle extends Needle {
    draw(angleRadians) {
        const lineLength = this.options.radius;
        const endX = this.centerX + lineLength * Math.cos(angleRadians);
        const endY = this.centerY + lineLength * Math.sin(angleRadians);

        // Draw the needle line
        this.context.beginPath();
        this.context.moveTo(this.centerX, this.centerY);
        this.context.lineTo(endX, endY);
        this.context.lineWidth = this.options.needle.needleWidth;
        this.context.strokeStyle = this.options.needle.needleColor;
        this.context.stroke();

        // Draw center circle
        this.context.beginPath();
        this.context.arc(this.centerX, this.centerY, this.options.needle.needleWidth, 0, 2 * Math.PI);
        this.context.fillStyle = '#fff';
        this.context.fill();
        this.context.strokeStyle = '#000';
        this.context.lineWidth = this.options.needle.needleWidth;
        this.context.stroke();

        // Draw end circle
        this.context.beginPath();
        this.context.arc(endX, endY, this.options.needle.needleWidth, 0, 2 * Math.PI);
        this.context.fillStyle = '#fff';
        this.context.fill();
        this.context.strokeStyle = '#000';
        this.context.lineWidth = this.options.needle.needleWidth;
        this.context.stroke();
    }
}

export default DefaultNeedle;