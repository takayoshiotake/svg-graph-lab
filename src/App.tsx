import { MouseEvent, useCallback, useState } from 'react';
import './App.css';

interface GraphItem {
  cx: number;
  cy: number;
  shape: string;
}

function App() {
  const [items, setItems] = useState<GraphItem[]>([]);
  const [selectedItemIndexes, setSelectedItemIndexes] = useState<number[]>([]);

  const addItem = useCallback(() => {
    const cx = Math.random() * (800 - 24) + 12;
    const cy = Math.random() * (600 - 24) + 12;
    setItems([
      ...items,
      {
        cx,
        cy,
        shape: 'rect',
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
        shape: 'rect',
      });
    }
    setItems(newItems);
  }, [items]);
  const alignAllItems = useCallback(() => {
    items.forEach((item) => {
      item.cx = Math.min(Math.max(Math.round(item.cx / 12) * 12, 12), 800 - 12);
      item.cy = Math.min(Math.max(Math.round(item.cy / 12) * 12, 12), 600 - 12);
    });
    setItems([...items]);
  }, [items]);
  const clearAllItems = useCallback(() => {
    setItems([]);
  }, []);

  const selectItem = useCallback(
    (event: MouseEvent<SVGElement>, index: number) => {
      if (event.button == 0) {
        // left button
        if (selectedItemIndexes.includes(index)) {
          return;
        }
        setSelectedItemIndexes([...selectedItemIndexes, index]);
      } else if (event.button == 2) {
        // right button
        items[index].shape = items[index].shape === 'rect' ? 'circle' : 'rect';
        setItems([...items]);
      }
    },
    [items, selectedItemIndexes],
  );
  const handleMouseMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (event.movementX == 0 && event.movementY == 0) {
        return;
      }
      if (selectedItemIndexes.length == 0) {
        return;
      }

      const newItems = [...items];
      selectedItemIndexes.forEach((index) => {
        newItems[index].cx = Math.min(
          Math.max(newItems[index].cx + event.movementX, 12),
          800 - 12,
        );
        newItems[index].cy = Math.min(
          Math.max(newItems[index].cy + event.movementY, 12),
          600 - 12,
        );
      });
      setItems(newItems);
    },
    [items, selectedItemIndexes],
  );
  const handleMouseUp = useCallback(() => {
    if (selectedItemIndexes.length > 0) {
      setSelectedItemIndexes([]);
    }
  }, [selectedItemIndexes]);

  const graph: JSX.Element[] = [];
  items.forEach((item, index) => {
    if (index > 0) {
      const x0 = items[index - 1].cx;
      const y0 = items[index - 1].cy;
      const x1 = items[index].cx;
      const y1 = items[index].cy;
      graph.push(
        <path
          className="path"
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
      <g
        key={index * 2 + 1}
        transform={`translate(${item.cx}, ${item.cy})`}
        onMouseDown={(event) => selectItem(event, index)}
      >
        {item.shape === 'rect' && (
          <rect
            x="-12"
            y="-12"
            width="24"
            height="24"
            stroke="black"
            fill="white"
            rx="8"
          />
        )}
        {item.shape === 'circle' && (
          <circle r="12" stroke="black" fill="white" rx="8" />
        )}
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
        <button onClick={alignAllItems} disabled={items.length == 0}>
          Align
        </button>
        <button onClick={clearAllItems} disabled={items.length == 0}>
          Clear
        </button>
      </div>
      <div
        id="grapharea"
        onContextMenu={(event) => {
          event.preventDefault();
          return false;
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <svg viewBox="0 0 800 600" width={800} height={600}>
          {[...Array(Math.round(800 / 12)).keys()].map((x) => {
            return (
              <path
                key={`x${x}`}
                d={`M${x * 12 - 0.5},0 V600`}
                stroke="rgba(0, 0, 0, 0.12)"
              ></path>
            );
          })}
          {[...Array(Math.round(600 / 12)).keys()].map((y) => {
            return (
              <path
                key={`y${y}`}
                d={`M0,${y * 12 - 0.5} H800`}
                stroke="rgba(0, 0, 0, 0.12)"
              ></path>
            );
          })}
          {graph}
        </svg>
      </div>
    </>
  );
}

export default App;
