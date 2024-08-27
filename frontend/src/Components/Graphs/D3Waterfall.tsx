import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const D3Waterfall = ({ powerData, waterfallXAxisData, waterfallYAxisData, minValue, maxValue }: any) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number, y: number, value: number, frequency: number } | null>(null);

  const generateColorScale = (colors: string[], minValue: number, maxValue: number) => {
    const numColors = colors.length;

    return d3.scaleLinear<string>()
      .domain(Array.from({ length: numColors }, (_, i) => minValue + (i * (maxValue - minValue) / (numColors - 1))))
      .range(colors)
      .interpolate(d3.interpolateRgb);
  };

  const generateAxisLabels = (min: number, max: number, numberOfLabels: number) => {
    const interval = (max - min) / (numberOfLabels - 1);
    const labels = [];

    for (let i = 0; i < numberOfLabels; i++) {
      const value = Math.round(min + i * interval)
      labels.push(value);
    }

    return labels;
  }


  const min = Math.min(...waterfallXAxisData);
  const max = Math.max(...waterfallXAxisData);

  // Set the number of labels to show on the X-axis
  const numberOfLabels = 10; // Number of labels you want to show on the X-axis


  const convertedXaxisData = generateAxisLabels(min, max, numberOfLabels);

  const colors = [
    "#00008B", // Dark Blue
    "#0504AA", // Duke Blue
    "#0137FF", // Blue Ribbon
    "#017EF5", // Blue Jeans
    "#00FA9F", // Medium Spring Green
    "#00FAF3", // Aqua/Cyan
    "#01E651", // Malachite
    "#59FA00", // Bright Lime Green
    "#D2F500", // Arctic Lime
    "#EAD600", // Dandelion
    "#F4C204", // Saffron
    "#FAA100", // Orange (Web)
    "#FF8800", // Dark Orange
    "#f55600", // Vivid Vermilion
    "#F53200", // Scarlet
    "#FA0101", // Red
  ];



  const colorScale = generateColorScale(colors, minValue, maxValue)



  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = powerData.length * 30 + 100;
    const barHeight = 30;
    const margin = { top: 20, right: 30, bottom: 110, left: 55 };

    ctx.clearRect(0, 0, width, height);

    // X Axis scale adjusted to accommodate all 8000 points
    const xScale = d3.scaleLinear()
      .domain([0, waterfallXAxisData.length - 1])
      .range([0, width]);





    // Drawing X-axis labels and tick marks
    ctx.fillStyle = 'white';
    ctx.textAlign = 'start';
    ctx.textBaseline = 'bottom';
    ctx.font = '12px Arial';



    // Y Axis scale
    const yScale = d3.scaleLinear()
      .domain([0, powerData.length])
      .range([0, height - margin.bottom]);

    waterfallYAxisData.forEach((d: number, i: number) => {
      const y = yScale(i);

      ctx.fillText(`${d} sec`, margin.left - 40, y + margin.top + barHeight / 2);
    });

    ctx.save();
    ctx.translate(margin.left, margin.top);

    // Plot all 8000 points
    powerData.forEach((row: number[], i: number) => {
      row.forEach((power, j) => {
        const x = xScale(j);
        const y = i * barHeight;

        ctx.fillStyle = colorScale(power);
        ctx.fillRect(x, y, width / row.length, barHeight);
      });
    });

    ctx.restore();

    // Add Mouse Event Listener for Tooltip
    canvas.addEventListener('mousemove', (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      let found = false;

      powerData.forEach((row: number[], i: number) => {
        row.forEach((power, j) => {
          const x = xScale(j) + margin.left;
          const y = i * barHeight + margin.top;

          if (
            mouseX >= x &&
            mouseX <= x + width / row.length &&
            mouseY >= y &&
            mouseY <= y + barHeight
          ) {
            setTooltip({
              x: mouseX,
              y: mouseY,
              value: power,
              frequency: waterfallXAxisData[j],
            });
            found = true;
          }
        });
      });

      if (!found) {
        setTooltip(null);
      }
    });

    return () => {
      canvas.removeEventListener('mousemove', () => { });
    };

  }, [powerData, colorScale, waterfallXAxisData, waterfallYAxisData]);

  return (
    <>
      <div className='flex items-center justify-center mr-14 relative'>
        <canvas ref={canvasRef} width={1220} height={330} />
        {tooltip && (
          <div
            style={{
              position: 'absolute',
              left: tooltip.x + 15,
              top: tooltip.y - 25,
              background: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: '5px',
              borderRadius: '3px',
              pointerEvents: 'none',
            }}
          >
            <div>Power: {tooltip.value} dBm</div>
            <div>Frequency: {tooltip.frequency.toFixed(4)} MHz</div>
          </div>
        )}

      </div>
      <div className='flex items-center justify-center mr-auto ml-auto relative w-[1166px] bg-white w-100 h-[1px]'>
      </div>
      <div className='flex items-center justify-center mr-auto ml-auto relative w-[1166px]'>

        {convertedXaxisData.map((value: number, index: number) =>
          <div
            key={index}
            className={
              index === 0 ? 'bg-white w-[1px] h-[4px] mr-auto ml-0' :
                (
                  index === convertedXaxisData.length - 1 ? 'bg-white w-[1px] h-[4px] mr-0 ml-auto' :
                    'bg-white w-[1px] h-[4px] mr-auto ml-auto'
                )
            }
          ></div>
        )}

      </div>


      <div className='flex items-center justify-between mr-auto ml-auto relative w-[1266px] text-[12px] border-t-1 border-white'>
        {convertedXaxisData.map((value: number, index: number) =>
          <div key={index} className='min-w-[100px] text-center'>{`${value} MHz`}</div>
        )}
      </div>

    </>

  );
};

export default D3Waterfall;
