
import { getUploadAuthParams } from "@imagekit/next/server";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Check whether the user is logged in
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Read ImageKit credentials
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

    if (!publicKey || !privateKey) {
      return NextResponse.json(
        { error: "ImageKit credentials are missing" },
        { status: 500 }
      );
    }

    // 3. Generate temporary upload authentication
    const { token, expire, signature } =
      getUploadAuthParams({
        publicKey,
        privateKey,
      });

    // 4. Send authentication parameters to frontend
    return NextResponse.json({
      token,
      expire,
      signature,
      publicKey,
    });

  } catch (error) {
    console.error("ImageKit authentication error:", error);

    return NextResponse.json(
      { error: "Failed to generate upload authentication" },
      { status: 500 }
    );
  }
}
