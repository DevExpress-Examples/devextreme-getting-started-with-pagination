/* eslint-disable space-before-function-paren */
/* eslint-disable no-console */
import React, {
  useEffect, useState, useCallback, useRef,
} from 'react';
import './App.css';
import 'devextreme/dist/css/dx.material.blue.light.compact.css';
import LoadPanel, { Position } from 'devextreme-react/load-panel';
import Pagination from 'devextreme-react/pagination';
import { fetchColorData, getRandomPastelColor } from './colorService';

const total = 100;

interface Color {
  image: string;
  name: string;
}

function App(): JSX.Element {
  const [loadPanelVisible, setLoadPanelVisible] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageIndex, setPageIndex] = useState<number>(3);
  const [visibleCards, setVisibleCards] = useState<Color[]>([]);

  const hexCodes = useRef<string[]>([]);
  const colorsCache = useRef<Map<string, Color>>(new Map());

  useEffect(() => {
    for (let i = 0; i < total; i++) {
      hexCodes.current.push(getRandomPastelColor());
    }
  }, []);

  const fetchColorsForPage = useCallback(async (): Promise<void> => {
    setLoadPanelVisible(true);
    const startIndex = (pageIndex - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const hexSubset = hexCodes.current.slice(startIndex, endIndex);

    const promises = hexSubset.map((hex) => {
      if (colorsCache.current.has(hex)) {
        return Promise.resolve(colorsCache.current.get(hex));
      }
      return fetchColorData(hex).then((color) => {
        if (color) {
          colorsCache.current.set(hex, color);
        }
        return color;
      });
    });

    try {
      const results = await Promise.all(promises);
      const filteredColors = results.filter((color): color is Color => color !== null);
      setVisibleCards(filteredColors);
    } catch (error) {
      console.error('Error fetching colors:', error);
    } finally {
      setLoadPanelVisible(false);
    }
  }, [pageIndex, pageSize]);

  const onPageIndexChange = useCallback((value: number) => {
    setPageIndex(value);
  }, []);

  const onPageSizeChange = useCallback((value: number) => {
    setPageSize(value);
  }, []);

  useEffect(() => {
    fetchColorsForPage().catch((error) => {
      console.error('Error updating visible cards:', error);
    });
  }, [fetchColorsForPage]);

  return (
    <div className="main">
      <LoadPanel
        visible={loadPanelVisible}
        showIndicator={true}
        showPane={true}
        hideOnOutsideClick={false}
      >
        <Position my="top" at="top" of="#cards" />
      </LoadPanel>
      <Pagination
        showInfo={true}
        showNavigationButtons={true}
        pageIndex={pageIndex}
        pageSize={pageSize}
        itemCount={total}
        onPageIndexChange={onPageIndexChange}
        onPageSizeChange={onPageSizeChange}
      />
      <div id="cards">
        {visibleCards.map((color, index) => (
          <div key={index}>
            <img src={color.image} alt={color.name} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
