import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3-client";

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${Date.now()}-${file.name}`;

  const command = new PutObjectCommand({
    Bucket: "devsathi-student-notes-2026",
    Key: fileName,
    Body: buffer,
    ContentType: file.type,
  });

  try {
    await s3Client.send(command);
    return new Response(JSON.stringify({ success: true, fileName }));
  } catch (err) {
    return new Response(JSON.stringify({ error: "S3 Upload Failed" }), { status: 500 });
  }
}