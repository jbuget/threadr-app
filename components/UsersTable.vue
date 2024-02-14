<script setup lang="ts">
import type { Session, User } from "@auth/core/types";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast'
const toast = useToast();

/* Model */
const users = [{
  id: '',
  name: '',
  email: '',
  emailVerified: true,
  image: '',
  accounts: [],
  sessions: [],
}]

/* Controller */

</script>

<template>
  <div class="users-table">
    <h2>Users</h2>
    <DataTable :value="users" tableStyle="min-width: 50rem">
      <Column field="id" header="ID"></Column>
      <Column field="name" header="Name"></Column>
      <Column field="email" header="Email"></Column>
      <Column field="emailVerified" header="Email verified"></Column>
      <Column field="Image" header="Image"></Column>
    </DataTable>
  </div>
</template>

<style scoped></style>