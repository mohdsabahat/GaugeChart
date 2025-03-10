import { deepMerge } from './utils';


class CreateChart {
    constructor(canvas, config){
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.defaultOptions = {
            startAngle: -Math.PI,
            endAngle: 0,
            thickness: 10,
            value: {
                display: true,
                fontSize: 20,
                color: '#000',
                value: 50,
                text: () => {return this.options.value.value},
                padding: {
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                },
            },
            title: {
                display: false,
                text: 'Gauge Chart',
                color: '#000',
                fontSize: 26,
                padding: {
                    bottom: 10,
                },
            },
            animation: {
                animate: true,
                animationSpeed: 1.5,
            },
            needle: {
                needleColor: '#000',
                needleWidth: 2,
            },
        };
        this.options = deepMerge(this.defaultOptions, config?.options);

        this.centerX = this.canvas.width / 2;
        this.centerY = (3 * this.canvas.height) / 4;
        this.options.radius = Math.min(canvas.width, canvas.height) / 2 - this.options.thickness -10;
    }

    /**
     * Renders the gauge chart.
     * If animation is enabled in the options, it animates the rendering of the chart.
     * Otherwise, it draws the title, regions, needle, and value label.
     * 
     * @method renderChart
     * @memberof GaugeChart
     * @instance
     */
    renderChart(){
        if(this.options.animation?.animate){
            this._animateRenderChart();
        } else {
            this.drawTitle();
            this.drawRegions();
            // calculate the angle for the value to diplay the needle
            const currentAngle = this.options.startAngle + (this.options.endAngle - this.options.startAngle) * this.options.value.value / 100;
            this.drawNeedle(currentAngle);
            this.drawValueLabel();
        }
    }

    // clear the canvas
    clearCanvas(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }


    /**
     * Creates a linear gradient for a specified region between two angles.
     *
     * @param {Object} region - The region object containing color information.
     * @param {string} region.startColor - The starting color of the gradient.
     * @param {string} region.endColor - The ending color of the gradient.
     * @param {number} startAngle - The starting angle in radians for the gradient.
     * @param {number} endAngle - The ending angle in radians for the gradient.
     * @returns {CanvasGradient} The created linear gradient.
     */
    createGradient(region, startAngle, endAngle){
        const gradient = this.context.createLinearGradient(
            this.centerX + this.options.radius * Math.cos(startAngle),
            this.centerY + this.options.radius * Math.sin(startAngle),
            this.centerX + this.options.radius * Math.cos(endAngle),
            this.centerY + this.options.radius * Math.sin(endAngle),
        );
        gradient.addColorStop(0, region.startColor);
        gradient.addColorStop(1, region.endColor);
        return gradient;
    }

    /**
     * Draws the title of the chart on the canvas.
     * 
     * This method checks if the title display option is enabled. If it is, it sets the 
     * fill style, font, text alignment, and text baseline for the title. It then calculates 
     * the vertical position of the title based on the center Y coordinate, radius, thickness, 
     * and padding options. Finally, it draws the title text at the calculated position.
     * 
     * @memberof Chart
     */
    drawTitle(){
        if(!this.options?.title?.display) return;
        this.context.fillStyle = this.options?.title?.color;
        this.context.font = `${this.options.title.fontSize}px Arial`;
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        const titleY = this.centerY - this.options.radius - this.options.thickness - this.options.title.padding.bottom;
        this.context.fillText(this.options.title.text, this.centerX, titleY);
    }

    /**
     * Draws an arc on the canvas.
     *
     * @param {number} startAngle - The starting angle of the arc in radians.
     * @param {number} endAngle - The ending angle of the arc in radians.
     * @param {Object} region - The region object used to create the gradient.
     */
    drawArc(startAngle, endAngle, region){
        const gradient = this.createGradient(region, startAngle, endAngle);
        this.context.strokeStyle = gradient;
        this.context.beginPath();
        this.context.arc(this.centerX, this.centerY, this.options.radius, startAngle, endAngle);
        this.context.lineWidth = this.options.thickness;
        this.context.stroke();
    }

    /**
     * Draws the regions on the gauge chart.
     * 
     * This method draws the regions specified in the options on the gauge chart.
     * It calculates the start and end angles for each region and draws an arc for each region.
     * Additionally, it draws semicircles at both ends of the arc to give the effect of rounded caps.
     * 
     * @throws {Error} If regions are not defined in the options.
     */
    drawRegions(){
        if(!this.options?.regions) {
            console.error('Regions are not defined');
            return;
        };
        let startAngle = this.options.startAngle;
        let endAngle;
        this.options.regions.forEach((region, idx) => {
            endAngle = startAngle + (this.options.endAngle - this.options.startAngle) * region.area;
            this.drawArc(startAngle, endAngle, region);
            startAngle = endAngle;
        });
        // after drawing the full arc now to give the effect of rounded caps at both end of the arc
        // we will draw emicircle fo same color as that part on either end of the semicircular arc.
        let newX = this.centerX - this.options.radius ;
        let newY = this.centerY;
        let radius = this.options.thickness / 2;
        this.context.beginPath();
        this.context.arc(newX, newY, radius, 0, -Math.PI);
        this.context.lineWidth = this.options.thickness /2 ;
        this.context.fillStyle = this.options.regions[0].startColor;
        this.context.fill();
        this.context.beginPath();
        this.context.arc(newX + 2 * this.options.radius , newY, radius, 0, Math.PI);
        this.context.lineWidth = this.options.thickness / 2;
        this.context.fillStyle = this.options.regions[this.options.regions.length - 1].endColor;
        this.context.fill();
    }

    /**
     * Draws the needle on the gauge chart.
     *
     * @param {number} angleRadians - The angle in radians at which the needle should be drawn.
     */
    drawNeedle(angleRadians) {
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
        this.context.arc(this.centerX, this.centerY, this.options?.needle.needleWidth, 0, 2 * Math.PI);
        this.context.fillStyle = '#fff';
        this.context.fill();
        this.context.strokeStyle = '#000';
        this.context.lineWidth = this.options.needle.needleWidth;;
        this.context.stroke();
  
        // Draw end circle
        this.context.beginPath();
        this.context.arc(endX, endY, this.options?.needle.needleWidth, 0, 2 * Math.PI);
        this.context.fillStyle = '#fff';
        this.context.fill();
        this.context.strokeStyle = '#000';
        this.context.lineWidth = this.options?.needle.needleWidth;
        this.context.stroke();
    }

    /**
     * Draws the value label on the gauge chart.
     * 
     * This method sets the fill style and font for the value label, aligns the text,
     * and then draws the value label at the specified position on the canvas.
     * 
     * If the `text` property of `this.options.value` is a function, it calls the function
     * with the value as an argument and uses the returned string as the label text.
     * Otherwise, it uses the `text` property directly as the label text.
     * If the `text` property is not defined, it uses the `value` property as the label text.
     * 
     * @method drawValueLabel
     * @memberof GaugeChart
     */
    drawValueLabel() {
        this.context.fillStyle = this.options.value.color;
        this.context.font = `${this.options.value.fontSize}px Arial`;
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        
        // check if value is a function if yes call it
        let fillText;
        if (this.options.value?.text) {
            fillText = typeof this.options.value.text === 'function' ? this.options.value.text(this.options.value.value) : this.options.value.text;
        } else {
            fillText = this.options.value.value;
        }
        fillText = fillText.toString();
        // Wrap text if too long
        const maxWidth = this.canvas.width - 20; // Adjust as needed
        const words = fillText.split(' ');
        let line = '';
        const lines = [];
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = this.context.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                lines.push(line);
                line = words[n] + ' ';
            } else {
                line = testLine;
            }
        }
        lines.push(line);
    
        // Draw each line
        const lineHeight = this.options.value.fontSize + 5; // Adjust as needed
        const startY = this.centerY + 20 + this.options.value.padding.top - (lines.length - 1) * lineHeight / 2;
        for (let i = 0; i < lines.length; i++) {
            this.context.fillText(lines[i], this.centerX, startY + i * lineHeight);
        }
    }

    /**
     * Animates the rendering of the gauge chart.
     * This function calculates the target angle based on the start angle, end angle, and the value provided in the options.
     * It uses `requestAnimationFrame` to animate the gauge needle smoothly from the start angle to the target angle.
     * During each frame, it clears the canvas, draws the title, regions, needle, and value label.
     * The animation speed is controlled by the `animationSpeed` option.
     * 
     * @private
     */
    _animateRenderChart(){
        const targetAngle = this.options.startAngle + this.options.value.value / 100 * (this.options.endAngle - this.options.startAngle);
        let startTime = null;
  
        const animateGauge = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = (timestamp - startTime) / 1000;
            const currentAngle = this.options.startAngle + Math.min(progress * this.options.animation.animationSpeed, 1) * (targetAngle - this.options.startAngle);

            this.clearCanvas();
            this.drawTitle();
            this.drawRegions();
            this.drawNeedle(currentAngle);
            this.drawValueLabel();

            if (progress < 1) {
                requestAnimationFrame(animateGauge);
            }
        };
  
        requestAnimationFrame(animateGauge);
    }
}

export default CreateChart;