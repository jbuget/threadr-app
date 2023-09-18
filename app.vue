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
        <div class="app-brand p-fluid">
          <a class="app-name" href="/">Threadr</a>
        </div>
        <div class="new-thread">
          <Button icon="pi pi-plus" aria-label="Submit" label="New thread" severity="secondary" outlined
            @click="newThread" @enter="newThread" />
        </div>
        <nav class="thread-summary-list">
          <ThreadSummaryList @threadSelected="loadThread" :key="threadSummaryListKey" />
        </nav>
      </div>

      <div class="layout-content-wrapper">
        <div class="layout-content-main">
          <ThreadEditor :threadId="threadId" @threadSaved="refreshThreadList" @threadDeleted="refreshThreadList" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: row;
  min-height: 100vh;
}

.layout-sidebar {
  height: 100vh;
  width: 20rem;
  max-width: 20rem;
  border-right: 1px solid lightgray;
  display: flex;
  flex-direction: column;
}

.app-brand {
  display: flex;
  align-items: center;
  height: 60px;
}

.app-name {
  font-weight: 800;
  font-size: 1.5rem;
  padding: 0.5rem 1rem;
  margin: 0.5rem;
  color: inherit;
  text-decoration: none;
}

.new-thread {
  margin: 1rem;
}

.thread-summary-list {
  overflow-y: auto;
}

.layout-content-wrapper {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
}

.layout-content-main {
  margin: 0 auto;
}
</style>