import { useMemo } from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from 'recharts';

interface CandleData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface CandlestickChartProps {
  data: CandleData[];
  height?: number;
  showVolume?: boolean;
}

// Custom candlestick bar component
interface CandlestickBarProps {
  payload?: CandleData;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

const CandlestickBar = (props: CandlestickBarProps) => {
  const { payload, x = 0, y = 0, width = 0, height = 0 } = props;
  
  if (!payload) return null;
  
  const { open, high, low, close } = payload;
  const isUp = close >= open;
  const color = isUp ? '#10b981' : '#ef4444'; // green for up, red for down
  
  const bodyHeight = Math.abs(close - open);
  const bodyY = Math.min(close, open);
  const wickTop = high;
  const wickBottom = low;
  
  // Scale values to chart coordinates
  const scaleY = (value: number) => {
    const min = Math.min(low, high, open, close);
    const max = Math.max(low, high, open, close);
    const range = max - min || 1;
    return y + height - ((value - min) / range) * height;
  };
  
  const wickTopY = scaleY(wickTop);
  const wickBottomY = scaleY(wickBottom);
  const bodyTopY = scaleY(Math.max(open, close));
  const bodyBottomY = scaleY(Math.min(open, close));
  const wickX = x + width / 2;
  
  return (
    <g>
      {/* Upper wick */}
      <line
        x1={wickX}
        y1={wickTopY}
        x2={wickX}
        y2={bodyTopY}
        stroke={color}
        strokeWidth={1}
      />
      
      {/* Lower wick */}
      <line
        x1={wickX}
        y1={bodyBottomY}
        x2={wickX}
        y2={wickBottomY}
        stroke={color}
        strokeWidth={1}
      />
      
      {/* Body */}
      <rect
        x={x + width * 0.2}
        y={bodyTopY}
        width={width * 0.6}
        height={Math.max(bodyBottomY - bodyTopY, 1)}
        fill={isUp ? color : color}
        stroke={color}
        strokeWidth={1}
        opacity={isUp ? 0.8 : 1}
      />
    </g>
  );
};

// Custom tooltip
const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isUp = data.close >= data.open;
    
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm">
        <p className="text-gray-300 mb-2">{new Date(label).toLocaleString()}</p>
        <div className="space-y-1">
          <p className="text-gray-300">
            Open: <span className="text-white">${data.open?.toFixed(2)}</span>
          </p>
          <p className="text-gray-300">
            High: <span className="text-white">${data.high?.toFixed(2)}</span>
          </p>
          <p className="text-gray-300">
            Low: <span className="text-white">${data.low?.toFixed(2)}</span>
          </p>
          <p className="text-gray-300">
            Close: <span className={isUp ? 'text-green-400' : 'text-red-400'}>
              ${data.close?.toFixed(2)}
            </span>
          </p>
          <p className="text-gray-300">
            Volume: <span className="text-white">{data.volume?.toLocaleString()}</span>
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export function CandlestickChart({ data, height = 400, showVolume = true }: CandlestickChartProps) {
  const chartData = useMemo(() => {
    return data.map(item => ({
      ...item,
      timestamp: new Date(item.timestamp).getTime(),
      // Add helper properties for rendering
      bodyTop: Math.max(item.open, item.close),
      bodyBottom: Math.min(item.open, item.close),
      bodyHeight: Math.abs(item.close - item.open),
    }));
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-500">
        No chart data available
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: showVolume ? 60 : 20,
          }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#374151" 
            vertical={false}
          />
          <XAxis
            dataKey="timestamp"
            type="number"
            scale="time"
            domain={['dataMin', 'dataMax']}
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
            stroke="#9ca3af"
            fontSize={12}
          />
          <YAxis
            domain={['dataMin - 1', 'dataMax + 1']}
            stroke="#9ca3af"
            fontSize={12}
            tickFormatter={(value) => `$${value.toFixed(2)}`}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Candlestick bars */}
          <Bar
            dataKey="close"
            shape={(props: any) => <CandlestickBar {...props} />}
          />
          
          {/* Volume bars at bottom if enabled */}
          {showVolume && (
            <Bar
              dataKey="volume"
              fill="#6b7280"
              opacity={0.3}
              yAxisId="volume"
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}