import { Client } from 'minio'

const minioClient = new Client({
    endPoint: process.env.MINIO_ENDPOINT_URL as string,
    port: parseInt(process.env.MINIO_ENDPOINT_PORT as string),
    useSSL: (process.env.MINIO_USE_SSL as string) === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY as string,
    secretKey: process.env.MINIO_SECRET_KEY as string,
})

export default defineEventHandler(async (event: any) => {
    const nodeRequestObject = event.node.req
//    const formData = await readMultipartFormData(event)
//    console.log(formData)

    const headers = getRequestHeaders(event)

    const body = await doSomethingWithNodeRequest(event.node.req);
    console.log(body)

    return { ok: true }
});

/**
 * @param {import('http').IncomingMessage} req
 */
function doSomethingWithNodeRequest(req: any) {
    return new Promise((resolve, reject) => {
        /** @type {any[]} */
        const chunks: any = [];
        req.on('data', (data: any) => {
            chunks.push(data);
        });
        req.on('end', async () => {
            const payload = Buffer.concat(chunks).toString()
            var metaData = {
                'Content-Type': 'application/octet-stream',
                'X-Amz-Meta-Testing': 1234,
                example: 5678,
            }
            // uploading object with string data on Body
            const bucketEndpointUrl = process.env.MINIO_ENDPOINT_URL as string
            const bucketName = process.env.MINIO_BUCKET_NAME as string
            const fileObjectKey = "test_file.png";

            console.log(`Uploading file ${fileObjectKey} to bucket ${bucketName} on MinIO instance at ${bucketEndpointUrl}...`)

            try {
                await minioClient.putObject(bucketName, `media/${fileObjectKey}`, payload)
                console.log(`Successfully uploaded ${bucketName}/${fileObjectKey}!`);
                resolve(payload);
            } catch (err) {
                if (err) return console.log(err)
            }
        });
        req.on('error', reject);
    });

}