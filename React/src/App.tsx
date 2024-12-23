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
  const isMounted = useRef(false);
  const [loadPanelVisible, setLoadPanelVisible] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageIndex, setPageIndex] = useState<number>(3);
  const [colors, setColors] = useState<Color[]>([]);
  const [visibleCards, setVisibleCards] = useState<Color[]>([]);

  const getVisibleCards = useCallback((currentPageIndex: number, currentPageSize: number): void => {
    const startIndex = (currentPageIndex - 1) * currentPageSize;
    const endIndex = startIndex + currentPageSize;
    const pageColors = colors.slice(startIndex, endIndex);
    setVisibleCards(pageColors);
    setLoadPanelVisible(false);
  }, [colors, visibleCards]);

  const generateColors = useCallback(async (total: number): Promise<void> => {
    setLoadPanelVisible(true);
    const promises: Promise<Color | null>[] = [];
    for (let i = 0; i < total; i++) {
      const hex = getRandomPastelColor();
      promises.push(fetchColorData(hex));
    }

    try {
      const results = await Promise.all(promises);
      const filteredColors = results.filter((color): color is Color => color !== null);
      setColors(filteredColors);
    } catch (error) {
      console.error('Error generating colors:', error);
    }
  }, [total]);

  const onPageIndexChange = useCallback((value: number) => {
    setPageIndex(value);
    getVisibleCards(value, pageSize);
  }, [pageSize, getVisibleCards]);

  const onPageSizeChange = useCallback((value: number) => {
    setPageSize(value);
    getVisibleCards(pageIndex, value);
  }, [pageIndex, getVisibleCards]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true; // Mark as mounted
      generateColors(total).catch((error) => {
        console.error('Error initializing colors:', error);
      });
    }
  }, []);

  useEffect(() => {
    if (colors.length > 0) {
      getVisibleCards(pageIndex, pageSize);
    }
  }, [colors]);

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
        {visibleCards.map((color) => (
          <div key={color.name}>
            <img src={color.image} alt={color.name} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
