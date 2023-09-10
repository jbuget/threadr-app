<script setup lang="ts">
import { generateUniqueKey } from './utils/utils';

const threadId: any = ref(null)
const threadSummaryListKey = ref(generateUniqueKey('thread-summary-list'))

async function loadThread(selectedTreadId: number) {
  threadId.value = selectedTreadId
  console.log('Selected thread with ID ', threadId.value)
}

async function refreshThreadList() {
  threadSummaryListKey.value = generateUniqueKey('thread-summary-list')
}

</script>

<template>
  <div class="app">
    <div class="layout-container">

      <div class="layout-sidebar">
        <ThreadSummaryList @threadSelected="loadThread" :key="threadSummaryListKey" />
      </div>

      <div class="layout-content-wrapper">
        <div class="layout-content-main">
          <ThreadEditor :threadId="threadId" @threadSaved="refreshThreadList" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app {}

.layout-container {
  display: flex;
  flex-direction: row;
  min-height: 100vh;
}

.layout-sidebar {
  position: fixed;
  height: 100%;
  top: 0;
  left: 0;
  width: 18rem;
  max-width: 18rem;
  overflow-y: auto;
  border: 1px solid lightgray;
}

.layout-content-wrapper {
  margin-left: 18rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.layout-content-main {
  margin: 0 auto;
}
</style>