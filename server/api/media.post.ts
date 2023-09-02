import formidable, { File } from 'formidable'
import { v4 as uuid } from 'uuid'
import { PassThrough, Writable } from 'node:stream'
import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { IncomingMessage } from 'http'

const s3Client = new S3Client({
    endpoint: process.env.MINIO_ENDPOINT as string,
    region: process.env.MINIO_REGION as string,
    credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY as string,
        secretAccessKey: process.env.MINIO_SECRET_KEY as string
    },
    /* 
    Required with MinIO in order to allow URL such as `minio.example.org/bucket_name` 
    instead of default generated URL `bucket_name.mino.example.org` 
    */
    forcePathStyle: true
})

function parseMultipartNodeRequest(req: IncomingMessage) {
    return new Promise((resolve, reject) => {
        const s3Uploads: Promise<any>[] = [];

        function fileWriteStreamHandler(file?: any) : Writable {
            const body = new PassThrough();
            if (!file) {
                return body
            }

            /*
            On préfixe le nom de fichier par uuid() :
            - par mesure de sécurité afin d'éviter le scrapping ou le listing par brute force
            - afin de pouvoir uploader plusieurs fichiers différents portant le même nom
            */
            const fileObjectKey = `${process.env.MINIO_MEDIA_PATH as string}/${uuid()}-${file.originalFilename}`

            const upload = new Upload({
                client: s3Client,
                params: {
                    Bucket: process.env.MINIO_BUCKET_NAME as string,
                    Key: fileObjectKey,
                    ContentType: file.mimetype,
                    Body: body,
                },
            });
            const uploadRequest = upload.done().then((response:any) => {
                file.objectKey = fileObjectKey
                file.location = response.Location
            });
            s3Uploads.push(uploadRequest);
            return body;
        }
        const form = formidable({
            multiples: true,
            fileWriteStreamHandler: fileWriteStreamHandler,
        });
        form.parse(req, (error, fields, files) => {
            if (error) {
                reject(error);
                return;
            }
            Promise.all(s3Uploads)
                .then((data: any) => {
                    console.log(data)
                    const response = { ...fields, ...files }
                    resolve(response);
                })
                .catch(reject);
        });
    });
}

export default defineEventHandler(async (event: any) => {
    let body;
    const headers = getRequestHeaders(event);

    if (headers['content-type']?.includes('multipart/form-data')) {
        body = await parseMultipartNodeRequest(event.node.req);
    } else {
        body = await readBody(event);
    }

    /* 
    cf. ~/node_modules/@types/formidable/index.d.ts
    default serialized fields: "size" | "filepath" | "originalFilename" | "mimetype" | "hash" | "newFilename" 
    */
    const responseData = body.attachments.map((file:any) => {
        return {
            location: file.location,
            size: file.size,
            mimetype: file.mimetype,
            newFilename: file.fileObjectKey,
            originalFilename: file.originalFilename
        }
    })

    return { files: responseData };
});
