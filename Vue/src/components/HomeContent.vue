<template>
  <div class="container">
    <DxLoadPanel
      v-model:visible="loadPanelVisible"
      :show-indicator="true"
      :show-pane="true"
      :hide-on-outside-click="false"
    >
      <DxPosition my="top" at="top" of="#cards" />
    </DxLoadPanel>
    <DxPagination
      :show-info="true"
      :show-navigation-buttons="true"
      v-model:page-index="pageIndex"
      v-model:page-size="pageSize"
      :item-count="total"
      @update:page-index="onPageIndexChange"
      @update:page-size="onPageSizeChange"
    />
    <div id="cards">
      <div v-for="color in visibleCards" :key="color.name">
        <img :src="color.image" :alt="color.name" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'devextreme/dist/css/dx.light.css';
import { ref, onMounted } from 'vue';
import { fetchColorData, getRandomPastelColor } from '../assets/colorService';
import { DxPagination } from 'devextreme-vue';
import { DxLoadPanel, DxPosition } from 'devextreme-vue/load-panel';

interface Color {
  image: string;
  name: string;
}

const total = 100;
const pageSize = ref(5);
const pageIndex = ref(3);
const loadPanelVisible = ref(false);
const visibleCards = ref([] as Color[]);

const hexCodes = ref<string[]>([]);
const colorCache = new Map<string, Color>();

const generateHexCodes = () => {
  for (let i = 0; i < total; i++) {
    hexCodes.value.push(getRandomPastelColor());
  }
};

const fetchColorsForPage = async () => {
  loadPanelVisible.value = true;
  const startIndex = (pageIndex.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  const hexSubset = hexCodes.value.slice(startIndex, endIndex);

  const promises = hexSubset.map((hex) => {
    if (colorCache.has(hex)) {
      return Promise.resolve(colorCache.get(hex));
    }
    return fetchColorData(hex).then((color) => {
      if (color) {
        colorCache.set(hex, color);
      }
      return color;
    });
  });

  try {
    const results = await Promise.all(promises);
    visibleCards.value = results.filter((color): color is Color => color !== null);
  } catch (error) {
    console.error('Error fetching colors:', error);
  } finally {
    loadPanelVisible.value = false;
  }
};

const onPageIndexChange = (value: number) => {
  pageIndex.value = value;
  fetchColorsForPage();
};

const onPageSizeChange = (value: number) => {
  pageSize.value = value;
  fetchColorsForPage();
};

onMounted(() => {
  generateHexCodes();
  fetchColorsForPage();
});
</script>

<style>
#cards {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
</style>