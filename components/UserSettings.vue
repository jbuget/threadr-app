<script setup lang="ts">
const props = defineProps<{
    settings: any | null
}>()
</script>

<template>
    <div class="user-settings" v-if="settings">
        <div class="displaying">
            <h3>Display</h3>
            <div class="form-fields">
                <div class="form-field">
                    <label class="field-name" for="display_name">Name</label>
                    <InputText class="field-value" id="display_name" type="text" v-model="settings.display_name"
                        placeholder="" />
                </div>
                <div class="form-field">
                    <label class="field-name" for="avatar_url">Avatar URL</label>
                    <InputText class="field-value" id="avatar_url" type="text" v-model="settings.avatar_url"
                        placeholder="" />
                </div>
            </div>
        </div>
        <Divider />
        <div class="writing">
            <h3>Platforms</h3>
            <!-- Bluesky -->
            <div :class="['platform-settings', { disabled: !settings.bluesky_enabled }]">
                <div class="platform-enabled">
                    <span class="platform-name">Bluesky</span>
                    <InputSwitch v-model="settings.bluesky_enabled" />
                </div>
                <div class="form-fields">
                    <div class="form-field">
                        <label class="field-name" for="bluesky_url">URL</label>
                        <InputText class="field-value" id="bluesky_url" type="text" v-model="settings.bluesky_url"
                            :disabled="settings.bluesky_enabled !== true" placeholder="" />
                    </div>
                    <div class="form-field">
                        <label class="field-name" for="bluesky_identifier">Identifier</label>
                        <InputText class="field-value" id="bluesky_identifier" type="text"
                            v-model="settings.bluesky_identifier" :disabled="settings.bluesky_enabled !== true"
                            placeholder="" />
                    </div>
                    <div class="form-field">
                        <label class="field-name" for="bluesky_password">Password</label>
                        <InputText class="field-value" id="bluesky_password" type="text" v-model="settings.bluesky_password"
                            :disabled="settings.bluesky_enabled !== true" placeholder="" />
                    </div>
                </div>
            </div>
            <!-- Mastodon -->
            <div :class="['platform-settings', { disabled: !settings.mastodon_enabled }]">
                <div class="platform-enabled">
                    <span class="platform-name">Mastodon</span>
                    <InputSwitch v-model="settings.mastodon_enabled" />
                </div>
                <div class="form-fields">
                    <div class="form-field">
                        <label class="field-name" for="mastodon_url">URL</label>
                        <InputText class="field-value" id="mastodon_url" type="text" v-model="settings.mastodon_url"
                            :disabled="settings.mastodon_enabled !== true" placeholder="https://piaille.fr" />
                    </div>
                    <div class="form-field">
                        <label class="field-name" for="mastodon_access_token">Access token</label>
                        <InputText class="field-value" id="mastodon_access_token" type="text"
                            v-model="settings.mastodon_access_token" :disabled="settings.mastodon_enabled !== true"
                            placeholder="" />
                    </div>
                </div>
            </div>
            <!-- Twitter -->
            <div :class="['platform-settings', { disabled: !settings.twitter_enabled }]">
                <div class="platform-enabled">
                    <span class="platform-name">Twitter</span>
                    <InputSwitch v-model="settings.twitter_enabled" />
                </div>
                <div class="form-fields">
                    <div class="form-field">
                        <label class="field-name" for="twitter_consumer_key">Consumer key</label>
                        <InputText class="field-value" id="twitter_consumer_key" type="text"
                            v-model="settings.twitter_consumer_key" :disabled="settings.twitter_enabled !== true"
                            placeholder="" />
                    </div>
                    <div class="form-field">
                        <label class="field-name" for="twitter_consumer_secret">Consumer secret</label>
                        <InputText class="field-value" id="twitter_consumer_secret" type="text"
                            v-model="settings.twitter_consumer_secret" :disabled="settings.twitter_consumer_secret !== true"
                            placeholder="" />
                    </div>
                    <div class="form-field">
                        <label class="field-name" for="twitter_access_token">Access token</label>
                        <InputText class="field-value" id="twitter_access_token" type="text"
                            v-model="settings.twitter_access_token" :disabled="settings.twitter_enabled !== true"
                            placeholder="" />
                    </div>
                    <div class="form-field">
                        <label class="field-name" for="twitter_access_secret">Access secret</label>
                        <InputText class="field-value" id="twitter_access_secret" type="text"
                            v-model="settings.twitter_access_secret" :disabled="settings.twitter_enabled !== true"
                            placeholder="" />
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<style>
.user-settings {
    display: flex;
    flex-direction: column;
    min-width: 600px;
}

.platform-settings {}

.platform-settings.disabled .field-name {
    opacity: 0.6;
}

.platform-name {
    display: block;
    font-weight: 600;
    font-size: 1.125rem;
}

.platform-enabled {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.form-fields {
    margin-bottom: 1rem;
}

.form-field {
    margin-bottom: 0.85rem;
}

.field-name {
    display: block;
    margin-bottom: 5px;
}

.field-value {}</style>