<script setup lang="ts">
definePageMeta({ middleware: "auth", auth: { guestRedirectTo: "/login" } })

const { session, status, cookies } = useAuth()
</script>

<template>
    <div class="page page--profile">
        <div>
            <h2>Status</h2>
            <span>{{ status }}</span>
        </div>
        <div>
            <h2>User</h2>
            <pre>{{ session?.user }}</pre>
        </div>
        <div>
            <h2>Cookies</h2>
            <pre>{{ cookies }}</pre>
        </div>
    </div>
</template>

<style scoped>

.page--profile {
    padding: 1rem;
}

</style>