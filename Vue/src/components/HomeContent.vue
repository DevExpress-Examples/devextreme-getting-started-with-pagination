<template>
  <div class="container">
    <DxLoadPanel
    v-model:visible="loadPanelVisible"
    :show-indicator="true"
    :show-pane="true"
    :hide-on-outside-click="false"
    >
    <DxPosition 
      my="top" at="top" of="#cards"
    />
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
const colors = ref([] as Color[]);
const loadPanelVisible = ref(false);
const visibleCards = ref([] as Color[]);

const generateColors = async () => {
  loadPanelVisible.value = true;
  const promises = [];
  for (let i = 0; i < total; i++) {
    const hex = getRandomPastelColor();
    promises.push(fetchColorData(hex));
  }
  const results = await Promise.all(promises);
  colors.value = results.filter((color): color is Color => color !== null);
  loadPanelVisible.value = false;
  getVisibleCards(pageIndex.value, pageSize.value);
};

const getVisibleCards = (pageIndex: number, pageSize: number) => {
  visibleCards.value = colors.value.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
}

const onPageIndexChange = (value: number) => {
  pageIndex.value = value;
  getVisibleCards(pageIndex.value, pageSize.value);
}

const onPageSizeChange = (value: number) => {
  pageSize.value = value;
  getVisibleCards(pageIndex.value, pageSize.value);
}

onMounted(() => {
  generateColors();
});
</script>

<style>
#cards {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
