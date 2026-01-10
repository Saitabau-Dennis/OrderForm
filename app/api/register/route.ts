import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { User } from "@/lib/models/User";
import { Store } from "@/lib/models/Store";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationCode } from "@/lib/actions/auth";

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

    const user = await User.create({
      name: storeName,
      email,
      password: hashedPassword,
    });

    // Create Store
    const slug = storeName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    await Store.create({
      userId: user._id,
      name: storeName,
      slug: `${slug}-${crypto.randomBytes(3).toString("hex")}`, // Ensure uniqueness
      whatsappNumber: "", // Optional now
      deliveryZones: [],
    });

    // Send verification email
    await sendVerificationCode(email);

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
