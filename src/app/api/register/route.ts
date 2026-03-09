import { NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationCode } from "@/lib/actions/auth";

// Registers a user + starter store, then triggers email verification.
export async function POST(req: Request) {
  try {
    const { storeName, email, password } = await req.json();

    if (!storeName || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        name: storeName,
        email,
        password: hashedPassword,
      }
    });

    // Create a default store immediately so onboarding can continue after verification.
    const slug = storeName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    
    const uniqueSlug = `${slug}-${crypto.randomBytes(3).toString("hex")}`;

    await db.store.create({
      data: {
        userId: user.id,
        name: storeName,
        slug: uniqueSlug,
        whatsappNumber: "",
      }
    });

    // Sends one-time code via email; account remains blocked until verified.
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
