<script setup lang="ts">
const threadId = 3
</script>

<template>
  <div class="app">
    <div class="layout-container">
      <div class="layout-sidebar">
        <Threads />
      </div>
      <div class="layout-content-wrapper">
        <div class="layout-content-main">
          <Editor :threadId="threadId" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
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
}

.layout-content-wrapper {
  margin-left: 18rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.layout-content-main {
  width: 500px;
  margin: 0 auto;
}
</style>