<script setup lang="ts">
definePageMeta({ middleware: "auth", auth: { guestRedirectTo: "/login" } })

const { signOut, session, status, cookies } = useAuth()


</script>

<template>
    <div class="page page--admin-users">
        <h1>Administration – Users</h1>
        <UsersTable></UsersTable>
    </div>
</template>

<style scoped>

.page--admin-users {
    padding: 1rem;
}

</style>