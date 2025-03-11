![Release](https://github.com/mohdsabahat/GaugeChart/actions/workflows/release.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue)
![Github Version](https://img.shields.io/github/v/release/mohdsabahat/GaugeChart)

# GaugeChart

A pure JavaScript library to create customizable gauge charts.

## Table of Contents

- [Usage](#usage)
- [Configuration](#configuration)
- [Development](#development)
- [License](#license)

## Usage

Check a basic example here: [https://codepen.io/mohdsabahat/pen/ZYEJMmb](https://codepen.io/mohdsabahat/pen/ZYEJMmb)


Include the built JavaScript file in your HTML:

> **Note:** We also provide the bundled minified release to download and use it in your project in the [release page](https://github.com/mohdsabahat/GaugeChart/releases).

```html
<script src="gaugeChart.min.js"></script>
<!-- Or using CDN -->
<script src ="https://cdn.jsdelivr.net/gh/mohdsabahat/GaugeChart@master/dist/gaugeChart.min.js"></script>
```

Create a canvas element in your HTML:
```html
<canvas id="gauge" width="300" height="300"></canvas>
```

Initialize the gauge chart in your JavaScript:
```html
<script>
    const canvas = document.getElementById('gauge');
    const options = {
        value: {
            value: 75,
        },
        thickness: 50,
        title: {
            display: true,
            text: 'Gauge Chart',
            fontSize: 30,
            padding: {
                bottom: 50,
            }
        },
        regions: [
            {startColor: '#FF0000', endColor: 'orange', area: 0.2},
            {startColor: 'orange', endColor: '#FFA500', area: 0.4},
            {startColor: '#FFA500', endColor: 'gold', area: 0.4},
        ],
        animation: {
            animationSpeed: 1.2,
        },
        needle: {
            needleColor: '#000',
            needleWidth: 10,
        }
    };
    const gauge = new GaugeChart.CreateChart(canvas, {options: options});
    gauge.renderChart();
</script>
```

## Configuration

The `options` object allows you to customize the gauge chart. Here are the available options:

## Configuration

The `options` object allows you to customize the gauge chart. Here are the available options:

- `value`: The value to be displayed on the gauge.
- `thickness`: The thickness of the gauge arc.
- `title`: Configuration for the title of the gauge chart.
  - `display`: Whether to display the title.
  - `text`: The text of the title.
  - `fontSize`: The font size of the title.
  - `padding`: Padding around the title.
- `regions`: An array of regions to display on the gauge.
  - `startColor`: The starting color of the region.
  - `endColor`: The ending color of the region.
  - `area`: The area of the region.
- `animation`: Configuration for the animation.
  - `animationSpeed`: The speed of the animation.
- `needle`: Configuration for the needle.
  - `needleColor`: The color of the needle.
  - `needleWidth`: The width of the needle.

## Development

To contribute to the development of GaugeChart, follow these steps:

1. Clone the repository:
    ```sh
    git clone https://github.com/mohdsabahat/GaugeChart.git
    ```
2. Navigate to the project directory:
    ```sh
    cd GaugeChart
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```
4. Start the development server:
    ```sh
    npm start
    ```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.