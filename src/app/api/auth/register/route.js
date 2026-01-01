export const runtime = "nodejs";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/db/models/user";
import { generateToken } from "@/lib/auth/jwt";
import { registerSchema } from "@/lib/validations/authSchema";
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const validation = registerSchema.safeParse({
      name: body.name,
      email: body.email,
      password: body.password,
      confirmPassword: body.confirmPassword,
      secretKey: body.secretKey,
    });
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validation.error.issues.map((err) => ({
            field: err.path[0],
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;
    const { role, secretKey } = body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // If registering as admin, verify authentication and secret key
    let userRole = "user";

    if (role === "admin") {
      // Check authentication
      const auth = await authenticate(request);

      // Either must be authenticated as admin OR provide secret key
      const hasAdminAuth = auth.isAuthenticated && requireAdmin(auth.user);
      const hasSecretKey = secretKey === process.env.ADMIN_SECRET_KEY;

      if (!hasAdminAuth && !hasSecretKey) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Unauthorized to create admin account. Valid admin credentials or secret key required.",
          },
          { status: 403 }
        );
      }

      userRole = "admin";
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
    });

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.email, user.role);
    const response = NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        data: {
          user: user.toJSON(),
          token,
        },
      },
      { status: 201 }
    );
    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
    response.cookies.set("role", user.role, {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
