import Plot from 'react-plotly.js';
import Cookies from 'js-cookie';
const Waterfall = ({ power, xFrequencies, yTimes }: any) => {

  if (!power || power.length === 0) {
    return <div>Loading...</div>;
  }

  const waterfallSettings = Cookies.get("WaterfallColorDivisionSetting");
  const waterfallSettingsObject = waterfallSettings !== undefined ? JSON.parse(waterfallSettings) : { divisions: 2 };
  const divisions: number = waterfallSettingsObject.divisions;


  // Predefined fixed colors for blending from dark blue to red
  const fixedColors: number[][] = [
    [0, 0, 139, 1],      // Dark Blue
    [0, 0, 255, 1],      // Blue
    [0, 255, 255, 1],    // Cyan
    [0, 255, 0, 1],      // Green
    [255, 255, 0, 1],    // Yellow
    [255, 165, 0, 1],    // Orange
    [255, 0, 0, 1]       // Red
  ];

  // Generate color scale based on divisions
  const generateColorScale = (colors: number[][], divisions: number): Array<[number, string]> => {
    const colorScale: Array<[number, string]> = [];
    const step = (colors.length - 1) / (divisions - 1);
    for (let i = 0; i < divisions; i++) {
      const colorIndex = Math.floor(i * step);
      const nextColorIndex = Math.ceil(i * step);
      const ratio = (i * step) % 1;
      const color = colors[colorIndex].map((start: any, index: any) => {
        const end = colors[nextColorIndex][index];
        return Math.round(start + (end - start) * ratio);
      });
      colorScale.push([i / (divisions - 1), `rgba(${color.join(',')})`]);
    }
    return colorScale;
  }

  const colorScale: Array<[number, string]> = generateColorScale(fixedColors, divisions);


  return (
    <div>
      <Plot
        data={[
          {
            z: power,
            x: xFrequencies,
            y: yTimes,
            type: 'heatmap',
            zsmooth: 'best',
            colorscale: colorScale,
            showscale: false,
            hoverinfo: "z+x",
            colorbar: {
              title: 'Power dB',
              titlefont: {
                color: 'white',
                family: 'Arial',
                size: 12
              },
              titleside: 'right',
              tickcolor: 'white', // Make colorbar tick labels white
              tickfont: {
                color: 'white',
                family: 'Arial',
                size: 12
              }
            }
          }
        ]}
        layout={{
          title: {
            text: 'Waterfall Display',
            font: {
              color: 'white', // Title text color
              size: 25,

            }
          },
          autosize: true,
          xaxis: {
            title: {
              text: 'Frequency (MHz)',
              font: {
                color: 'white' // X-axis title text color
              }
            },
            autorange: true,
            showgrid: true, // Display grid
            gridcolor: 'grey', // Grid color
            tickcolor: 'white', // X-axis tick labels color
            tickfont: {
              color: 'white' // Color for tick labels
            }
          },
          yaxis: {
            title: {
              text: 'Second (s)',
              font: {
                color: 'white' // Y-axis title text color
              }
            },
            autorange: 'reversed',
            showgrid: true, // Display grid
            gridcolor: 'grey', // Grid color
            tickcolor: 'white', // Y-axis tick labels color
            tickfont: {
              color: 'white' // Color for tick labels
            }
          },
          paper_bgcolor: 'rgba(0, 0, 0, 0)', // Transparent background color of the entire plot
          plot_bgcolor: 'rgba(0, 0, 0, 0)', // Transparent background color of the plotting area
        }}
        style={{ width: "100%", height: "100%" }}
        useResizeHandler={true}
        config={{ displayModeBar: false }}  // Disable display mode bar
      />
    </div>
  );
};

export default Waterfall;
