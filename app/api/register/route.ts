import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { User } from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/lib/mail";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { storeName, email, password } = await req.json();

    if (!storeName || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomUUID();
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await User.create({
      name: storeName,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiry,
    });

    await sendVerificationEmail(email, verificationToken);

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
