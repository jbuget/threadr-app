<script setup lang="ts">
import { useToast } from "primevue/usetoast";
import { Thread } from "~/models/models";
const toast = useToast();

/* Model */

const updateKey = ref(1)

const props = defineProps<{
  threadId: number | null
}>()

const { data: thread, pending } = await useAsyncData(
  'thread',
  async () => {
    let thread: Thread
    if (props.threadId) {
      const threadData = await $fetch(`/api/threads/${props.threadId}`, {})
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
    return thread
  }, {
  watch: [props]
})

/* Controller */

function addMessageBelow(index: number): void {
  console.log('addMessageBelow', index)
  if (thread.value && thread.value.messages) {
    thread.value.messages.splice(index, 0, { text: '', attachments: [] });
  }
  updateKey.value++
}

function removeMessage(index: number): void {
  if (thread.value && thread.value.messages) {
    thread.value.messages.splice(index, 1);
    if (thread.value.messages.length === 0) {
      addMessageBelow(0)
    }
  }
  updateKey.value++
}

async function saveThread(): Promise<void> {
  if (thread.value && thread.value.messages) {
    await $fetch('/api/threads', { method: 'post', body: { messages: thread.value.messages } })
    toast.add({ severity: 'success', summary: 'Thread saved', detail: `${thread.value.messages.length} posts published`, life: 3000 });
  }
}

async function publishThread(): Promise<void> {
  if (thread.value && thread.value.messages) {
    const nonEmptyMessages = thread.value.messages.filter((message: any) => message.text.trim().length > 0 || message.attachments.length > 0)
    await $fetch('/api/publications', { method: 'post', body: { messages: nonEmptyMessages } })
    toast.add({ severity: 'success', summary: 'Thread published', detail: `${nonEmptyMessages.length} posts published`, life: 3000 });
  }
}

</script>

<template>
  <div class="editor">
    <Toast />
    <!-- you will need to handle a loading state -->
    <div v-if="!pending && thread">
      <h2>ID: {{ thread.id }}</h2>
      <div class="messages">
        <template v-for="(message, index) in thread.messages" :key="updateKey">
          <div class="message">
            <MessageEditor :index="index" :message="message" @addMessageBelow="addMessageBelow(index + 1)"
              @removeMessage="removeMessage(index)" />
          </div>
          <Divider />
          <div class="actions">
            <div class="save">
              <Button label="Save" icon="pi pi-save" severity="info" size="small" @click="saveThread" />
            </div>
            <div class="publish">
              <Button label="Publish" icon="pi pi-send" severity="success" size="small" @click="publishThread" />
            </div>
          </div>
        </template>
      </div>
      <p>{{ thread }}</p>
    </div>
    <div v-else>
      Loading...
    </div>

  </div>
</template>

<style>
.messages {
  margin: 40px auto;
  display: flex;
  flex-direction: column;
}

.actions {
  display: flex;
  align-items: center;
}
</style>