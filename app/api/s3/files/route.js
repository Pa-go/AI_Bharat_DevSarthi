import { S3Client, ListObjectsV2Command, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = "devsathi-student-notes-2026";

export async function GET() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
    });

    const { Contents } = await s3Client.send(command);
    
    const files = Contents?.map(obj => ({
      id: obj.ETag.replace(/"/g, ""), 
      key: obj.Key,
      name: obj.Key.split('/').filter(Boolean).pop() || obj.Key, 
      // STRICT TYPE CHECK
      type: obj.Key.endsWith('/') ? 'folder' : (obj.Key.toLowerCase().endsWith('.pdf') ? 'pdf' : 'code'),
    })) || [];

    return NextResponse.json({ files });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { key, content = "" } = await request.json();
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME, 
      Key: key, 
      Body: content,
      ContentType: key.endsWith('/') ? 'application/x-directory' : (key.endsWith('.pdf') ? 'application/pdf' : 'text/plain'),
    });

    await s3Client.send(command);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("S3 API ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { key } = await request.json();
    
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}