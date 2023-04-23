import { useCallback, useState } from 'react';
import './App.css';

interface GraphItem {
  cx: number;
  cy: number;
}

function App() {
  const [items, setItems] = useState<GraphItem[]>([]);
  const addItem = useCallback(() => {
    const cx = Math.random() * (800 - 24) + 12;
    const cy = Math.random() * (600 - 24) + 12;
    setItems([
      ...items,
      {
        cx,
        cy,
      },
    ]);
  }, [items]);
  const addAllItems = useCallback(() => {
    const newItems = [...items];
    while (newItems.length < 20) {
      const cx = Math.random() * (800 - 24) + 12;
      const cy = Math.random() * (600 - 24) + 12;
      newItems.push({
        cx,
        cy,
      });
    }
    setItems(newItems);
  }, [items]);
  const clearAllItems = useCallback(() => {
    setItems([]);
  }, []);

  const graph = items.map((item, index) => {
    return (
      <g key={index} transform={`translate(${item.cx}, ${item.cy})`}>
        <rect
          x="-12"
          y="-12"
          width="24"
          height="24"
          stroke="black"
          fill="none"
          rx="8"
        />
        <text textAnchor="middle" dominantBaseline="central">
          {index + 1}
        </text>
      </g>
    );
  });
  for (let i = 0; i < items.length - 1; ++i) {
    const x0 = items[i].cx;
    const y0 = items[i].cy;
    const x1 = items[i + 1].cx;
    const y1 = items[i + 1].cy;
    graph.push(
      <path
        key={20 + i}
        d={`M${x0},${y0 + 12}
            Q${x0},${y0 + 36} ${(x0 + x1) / 2},${(y0 + y1) / 2}
            Q${x1},${y1 - 36} ${x1},${y1 - 12}`}
        fill="none"
        stroke="black"
      ></path>,
    );
  }
  return (
    <>
      <div id="actionbar">
        <button onClick={addItem} disabled={items.length >= 20}>
          Add
        </button>
        <button onClick={addAllItems} disabled={items.length >= 20}>
          Add All
        </button>
        <button onClick={clearAllItems} disabled={items.length == 0}>
          Clear
        </button>
      </div>
      <div id="grapharea">
        <svg viewBox="0 0 800 600" width={800} height={600}>
          {graph}
        </svg>
      </div>
    </>
  );
}

export default App;
