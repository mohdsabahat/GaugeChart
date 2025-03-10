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

    drawTitle(){
        if(!this.options?.title?.display) return;
        this.context.fillStyle = this.options?.title?.color;
        this.context.font = `${this.options.title.fontSize}px Arial`;
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        const titleY = this.centerY - this.options.radius - this.options.thickness - this.options.title.padding.bottom;
        this.context.fillText(this.options.title.text, this.centerX, titleY);
    }

    drawArc(startAngle, endAngle, region){
        const gradient = this.createGradient(region, startAngle, endAngle);
        this.context.strokeStyle = gradient;
        this.context.beginPath();
        this.context.arc(this.centerX, this.centerY, this.options.radius, startAngle, endAngle);
        this.context.lineWidth = this.options.thickness;
        this.context.stroke();
    }

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

    drawValueLabel() {
        this.context.fillStyle = this.options.value.color;
        this.context.font = `${this.options.value.fontSize}px Arial`;
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        // check if value is a function if yes call it
        let fillText;
        if(this.options.value?.text){
            fillText = typeof this.options.value.text === 'function' ? this.options.value.text(this.options.value.value) : this.options.value.text;
        } else {
            fillText = this.options.value.value;
        }
        this.context.fillText(fillText, this.centerX, this.centerY + 20 + this.options.value.padding.top);
    }

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