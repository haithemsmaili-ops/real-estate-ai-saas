import { NextRequest, NextResponse } from "next/server";
import { jsonDb } from "@/lib/db/json-db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Missing email parameter" },
        { status: 400 }
      );
    }

    // إضائة await هنا تحل الخطأ مباشرة
    const user = await jsonDb.getUserByEmail(email);

    if (!user) {
      return NextResponse.json({
        hasPaid: false,
        paymentTimestamp: null,
        subscriptionStatus: "none",
        adminActivated: false,
      });
    }

    return NextResponse.json({
      hasPaid: user.hasPaid || false,
      paymentTimestamp: user.paymentTimestamp || null,
      subscriptionStatus: user.subscriptionStatus || "none",
      adminActivated: (user as any).adminActivated || false,
    });
  } catch (error) {
    console.error("Error fetching payment status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch payment status" },
      { status: 500 }
    );
  }
}