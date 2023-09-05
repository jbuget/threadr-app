# Threadr

Threadr is a small (#workinprogress) web application that helps users of micro-blogging platforms to write great threads and allows them to crosspost in one click their content to Bluesky, Mastodon and Twitter/X.

## Installation

For now, Threadr only works in localhost.

**1/** Get the project sources

```shell
$ git clone git@github.com:jbuget/threadr-app.git && cd threadr-app
```

**2/** Copy the `.env.sample` file into a new `.env` file

You previously must generate, get and report your access keys for Twitter/X (new developer project), Mastodon (new app) and Bluesky (your user credentials).

**3/** Run the Docker compose service `minio` (required to upload media files into platforms)

```shell
$ docker compose -d minio
```

**4/** Configure your MinIO instance

MinIO console is accessible on [localhost:9001](http://localhost:9001) (credentials in `.env`file, cf. `MINIO_ROOT_USER` and `MINIO_ROOT_PASSWORD`)

Create a bucket (ex: "threadr-app" in `.env.sample`).

In the settings, configure MinIO region (ex: "eu-fr-1" in `.env.sample`).

> ⚠️ It is recommanded to declare a custom policy with dedicacted path in `readonly` acces for anonymous visitors

**5/** Run Threadr locally

```shell
$ npm install
$ npm run dev -- -o
```

**6/** 🚀 Enjoy Threadr at [localhost:3000](http://localhost:3000)!

<p align="center">
    <img src="/threader.png" width="480">
</p>

## Configuration

All configuration option are set in the `.env` file.

<details>

<summary>Editing threads, messages and media</summary>

**`DISPLAYING_NAME`: string**

The name displayed on the header of each message in the Editor.

</details>

<details>

<summary>Publishing on Bluesky</summary>

**`BLUESKY_ENABLED`: boolean**

Activate or deactivate posting on Bluesky platform.

**`BLUESKY_URL`: URL**

Bluesky is based on the [Authenticated Transfer Protocol](https://atproto.com/guides/overview). 
Today, Bluesky API endpoint URL is `https://bsky.social` but maybe one day it will be a different one.

**`BLUESKY_IDENTIFIER`: string**

The username of the Bluesky publisher account.

**`BLUESKY_PASSWORD`: string**

The password of the Bluesky publisher account.

</details>

<details>

<summary>Publishing on Mastodon</summary>

**`MASTODON_ENABLED`: boolean**

Activate or deactivate posting on Mastodon platform.

**`MASTODON_URL`: URL**

The Mastodon instance URL.Check that the instance allows API.

**`MASTODON_ACCESS_TOKEN`: string**

The token of the Mastodon publisher app.

</details>

<details>

<summary>Publishing on Twitter</summary>

**`TWITTER_ENABLED`: boolean**

Activate or deactivate posting on Twitter platform.

> cf. [the official Twitter documentation](https://developer.twitter.com/en/docs/authentication/oauth-1-0a/api-key-and-secret) about how to generate tokens.

**`TWITTER_CONSUMER_KEY`: string**

The Twitter app Consumer Key.

**`TWITTER_CONSUMER_SECRET`: string**

The Twitter app Consumer Secret.

**`TWITTER_ACCESS_TOKEN`: string**

Twitter app’s authentication access token.

> cf. [OAuth 2.0 Authorization Code](https://developer.twitter.com/en/docs/authentication/oauth-2-0/authorization-code)
**`TWITTER_ACCESS_SECRET`: string**

Twitter app’s authentication access secret.
</details>

<details>

<summary>Uploading media files</summary>

**`MINIO_ENDPOINT`: URL**

The endpoint URL of MinIO/S3 server on which temporarily upload media files.

**`MINIO_REGION`: string**

The region of the MinIO/S3 server.

**`MINIO_BUCKET_NAME`: string**

The bucket where the media files will be upload before being sent to platforms.

**`MINIO_MEDIA_PATH`: string**

The folder path inside the bucket.

**`MINIO_ACCESS_KEY`: string**

The MinIO access key to access the bucket in order to deposit media files.

**`MINIO_SECRET_KEY`: string**

The MinIO access secret key to access the bucket in order to deposit media files.

**`MINIO_ROOT_USER`: string**

The MinIO administration account username (used for docker-compose MinIO container).

**`MINIO_ROOT_PASSWORD`: string**

The MinIO administration account password (used for docker-compose MinIO container).

</details>

<details>
<summary>Persisting data</summary>

**`DATABASE_URL`: (PostgreSQL) URL**

The PostgreSQL database URL

**`POSTGRES_USER`: string**

The PostgreSQL administration account username (used for docker-compose postgres container).

**`POSTGRES_PASSWORD`: string**

The PostgreSQL administration account password (used for docker-compose postgres container).

**`POSTGRES_DB`: string**

The PostgreSQL database.

</details>