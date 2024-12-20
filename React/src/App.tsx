import React, { useEffect, useState, useCallback } from 'react';
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
  const [colors, setColors] = useState<Color[]>([]);
  const [visibleCards, setVisibleCards] = useState<Color[]>([]);
  const [loadingComplete, setLoadingComplete] = useState<boolean>(false); // Track entire loading/rendering state

  // Get visible cards based on pageIndex and pageSize
  function getVisibleCards(currentPageIndex: number, currentPageSize: number): void {
    if (colors.length > 0) {
      const startIndex = (currentPageIndex - 1) * currentPageSize;
      const endIndex = startIndex + currentPageSize;
      const pageColors = colors.slice(startIndex, endIndex);
      if (pageColors.length < currentPageSize) {
        console.warn(
          `Expected ${currentPageSize} visible cards but only found ${pageColors.length}. Check pagination.`,
        );
      }
      setVisibleCards(pageColors);
    }
  }

  const onPageIndexChange = useCallback((value: number) => {
    setPageIndex(value);
    getVisibleCards(value, pageSize);
  }, [pageSize, colors]);
  const onPageSizeChange = useCallback((value: number) => {
    setPageSize(value);
    getVisibleCards(pageIndex, value);
  }, [pageIndex, colors]);
  async function generateColors(total: number, pageIndex: number, pageSize: number): Promise<void> {
    setLoadPanelVisible(true);
    setLoadingComplete(false); // Reset loading state
    const promises: Promise<Color | null>[] = [];
    for (let i = 0; i < total; i++) {
      const hex = getRandomPastelColor();
      promises.push(fetchColorData(hex));
    }
    try {
      const results = await Promise.all(promises);
      // Filter out null results and ensure the array length matches the total
      const filteredColors = results.filter((color): color is Color => color !== null);
      if (filteredColors.length < total) {
        console.warn(`Expected ${total} colors but received ${filteredColors.length}.`);
      }
      setColors(filteredColors);
      // Calculate visible cards after setting all colors
      getVisibleCards(pageIndex, pageSize);
    } catch (error) {
      console.error('Error generating colors:', error);
    } finally {
      setLoadingComplete(true);
    }
  }
  // Load initial data on mount
  useEffect(() => {
    generateColors(total, pageIndex, pageSize).catch((error) => {
      console.error('Error initializing colors:', error);
    });
  }, []); // Only run on initial mount

  // Hide LoadPanel when rendering is complete
  useEffect(() => {
    if (loadingComplete && visibleCards.length > 0) {
      setLoadPanelVisible(false);
    }
  }, [loadingComplete, visibleCards]);

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
