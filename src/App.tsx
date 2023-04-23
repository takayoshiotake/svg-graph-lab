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

  const graph: JSX.Element[] = [];
  items.forEach((item, index) => {
    if (index > 0) {
      const x0 = items[index - 1].cx;
      const y0 = items[index - 1].cy;
      const x1 = items[index].cx;
      const y1 = items[index].cy;
      graph.push(
        <path
          key={index * 2 + 0}
          d={`M${x0},${y0 + 12}
              Q${x0},${y0 + 36} ${(x0 + x1) / 2},${(y0 + y1) / 2}
              Q${x1},${y1 - 36} ${x1},${y1 - 12}`}
          fill="none"
          stroke="black"
        ></path>,
      );
    }
    graph.push(
      <g key={index * 2 + 1} transform={`translate(${item.cx}, ${item.cy})`}>
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
      </g>,
    );
  });
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
