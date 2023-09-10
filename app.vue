<script setup lang="ts">
const threadId: any = ref(null)

async function loadThread(selectedTreadId: number) {
  threadId.value = selectedTreadId
  console.log('Selected thread with ID ', threadId.value)
  await refresh()
}

const { data, pending, refresh } = await useAsyncData(
  async () => {

    const threadsData = await $fetch('/api/threads')
    const threads = threadsData.map((threadData: any) => ({
      id: threadData.id,
      createdAt: threadData.createdAt,
      updatedAt: threadData.updatedAt,
      published: threadData.published,
      nbMessages: threadData.nbMessages
    }))

    let thread
    if (threadId.value) {
      const threadData = await $fetch(`/api/threads/${threadId.value}`, {})
      thread = {
        id: threadData.id,
        messages: threadData.latest.data.messages.map((message: any) => {
          const result = {
            text: message.text,
            attachments: message.attachments.map((attachment: any) => {
              const result = {
                filename: attachment.filename,
                location: attachment.location,
                mimetype: attachment.mimetype,
                size: attachment.size,
                alt: attachment.alt
              }
              return result
            })
          }
          return result
        })
      }
    } else {
      thread = {
        messages: [{
          text: '',
          attachments: []
        }]
      }
    }
    return { threads, thread }
  }
)

</script>

<template>
  <div class="app">
    <div class="layout-container" v-if="data">
      <div class="layout-sidebar">
        <ThreadSummaryList :threads="data.threads" @threadSelected="loadThread" />
      </div>
      <div class="layout-content-wrapper">
        <div class="layout-content-main">
          <ThreadEditor :thread="data.thread" />
        </div>
      </div>
    </div>
    <div v-else>
      Loading...
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