<script setup lang="ts">
import { generateUniqueKey } from './utils/utils';

const threadId: any = ref(null)
const threadSummaryListKey = ref(generateUniqueKey('thread-summary-list'))

async function loadThread(selectedTreadId: number) {
  threadId.value = selectedTreadId
}

async function refreshThreadList() {
  threadSummaryListKey.value = generateUniqueKey('thread-summary-list')
}

function newThread() {
  threadId.value = null
}
</script>

<template>
  <div class="app">
    <div class="layout-container">

      <div class="layout-sidebar">
        <nav>
          <div class="app-brand">
            <span class="app-name">Threadr</span>
          </div>
          <div class="new-thread">
            <Button icon="pi pi-plus" aria-label="Submit" label="New thread" severity="secondary" outlined
              @click="newThread" @enter="newThread" />
          </div>
          <ThreadSummaryList @threadSelected="loadThread" :key="threadSummaryListKey" />
        </nav>
      </div>

      <div class="layout-content-wrapper">
        <div class="layout-content-main">
          <ThreadEditor :threadId="threadId" @threadSaved="refreshThreadList" @threadDeleted="refreshThreadList"/>
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
  display: flex;
  flex-direction: column;
}

.app-brand {
  border-bottom: 1px solid lightgray;
  display: flex;
  align-items: center;
  height: 60px;
}

.app-name {
  font-weight: 800;
  font-size: 1.5rem;
  margin: 0.5rem;
}

.new-thread {
  margin: 0.5rem;
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