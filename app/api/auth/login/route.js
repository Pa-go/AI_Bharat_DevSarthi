import { NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";

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
    const { email, password } = await req.json();

    // 1. Find user in DynamoDB
    const result = await docClient.send(new GetCommand({
      TableName: "DevSathiUsers",
      Key: { email }
    }));

    const user = result.Item;

    // 2. If user doesn't exist
    if (!user) {
      return NextResponse.json({ error: "Invalid Email or Password" }, { status: 401 });
    }

    // 3. Check if password matches (Comparing plain text to the Hash in AWS)
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json({ error: "Invalid Email or Password" }, { status: 401 });
    }

    // 4. Success! (In a real app, you'd create a Session/Cookie here)
    return NextResponse.json({ 
      message: "Login successful", 
      user: { name: user.name, email: user.email, university: user.university } 
    }, { status: 200 });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Server Error during Login" }, { status: 500 });
  }
}