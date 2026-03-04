import { NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const docClient = DynamoDBDocumentClient.from(client);

export async function POST(req) {
  try {
    const { email, githubRepo } = await req.json();

    // ✅ Update DynamoDB: Set githubLinked to true and save the repo name
    await docClient.send(new UpdateCommand({
      TableName: "DevSathiUsers",
      Key: { email },
      UpdateExpression: "set githubLinked = :l, githubRepo = :r",
      ExpressionAttributeValues: {
        ":l": true,
        ":r": githubRepo,
      },
    }));

    return NextResponse.json({ message: "GitHub Linked Successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Link failed" }, { status: 500 });
  }
}