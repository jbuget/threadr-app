<script setup lang="ts">
import { generateUniqueKey } from './utils/utils'
import { useToast } from 'primevue/usetoast'
import Dialog from 'primevue/dialog'

const toast = useToast();

const { data: settings, pending, error, refresh } = await useFetch(`/api/settings`, {
  transform: (input: any) => {
    let settings: any

    if (input) {
      settings = input
    } else {
      settings = {}
      settings.display_name = ''
      settings.avatar_url = ''
      settings.bluesky_enabled = false
      settings.bluesky_url = ''
      settings.bluesky_identifier = ''
      settings.bluesky_password = ''
      settings.mastodon_enabled = false
      settings.mastodon_url = ''
      settings.mastodon_access_token = ''
      settings.twitter_enabled = false
      settings.twitter_consumer_key = ''
      settings.twitter_consumer_secret = ''
      settings.twitter_access_token = ''
      settings.twitter_access_secret = ''
    }
    return settings
  }
})

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

const userSettingsDialogVisible = ref(false)

function openUserSettingsDialog() {
  userSettingsDialogVisible.value = true
}
function closeUserSettingsDialog() {
  userSettingsDialogVisible.value = false
}

async function saveSettings() {
  const body = Object.fromEntries(
    [
      'display_name',
      'avatar_url',
      'bluesky_enabled',
      'bluesky_url',
      'bluesky_identifier',
      'bluesky_password',
      'mastodon_enabled',
      'mastodon_url',
      'mastodon_access_token',
      'twitter_enabled',
      'twitter_consumer_key',
      'twitter_consumer_secret',
      'twitter_access_token',
      'twitter_access_secret',
    ]
      .filter(key => key in settings.value)
      .map(key => [key, settings.value[key]])
  )

  const response: any = await $fetch('/api/settings', { method: 'patch', body })
  toast.add({ severity: 'success', summary: 'Settings saved', detail: `Settings saved`, life: 3000 });
  closeUserSettingsDialog()
}

</script>

<template>
  <div class="app">
    <Toast />
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
        <div class="open-settings">
          <Button icon="pi pi-plus" aria-label="Open user settings" label="Settings" outlined
            @click="openUserSettingsDialog" @enter="openUserSettingsDialog" />
        </div>
      </div>

      <div class="layout-content-wrapper">
        <div class="layout-content-main">
          <ThreadEditor :threadId="threadId" @threadSaved="refreshThreadList" @threadDeleted="refreshThreadList" />
        </div>
      </div>
    </div>
  </div>
  <Dialog class="p-fluid" v-model:visible="userSettingsDialogVisible" modal @hide="closeUserSettingsDialog">
    <template #header>
      <h3>User settings</h3>
    </template>
    <UserSettings :settings="settings" />
    <template #footer>
      <Button label="Cancel" icon="pi pi-times" @click="closeUserSettingsDialog" text />
      <Button label="Save" icon="pi pi-check" @click="saveSettings" />
    </template>
  </Dialog>
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
  padding: 1rem;
}

.open-settings {
  padding: 1rem;
  border-top: 1px solid lightgray;
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