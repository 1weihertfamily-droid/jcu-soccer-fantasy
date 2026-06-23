import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  try {
    const {
      visitorId,
      userAgent,
      screenWidth,
      screenHeight,
      page,
    } = await req.json();

    const { error } = await supabaseAdmin
      .from("site_visitors")
      .insert({
        visitor_id: visitorId,
        user_agent: userAgent,
        screen_width: screenWidth,
        screen_height: screenHeight,
        page,
      });

    if (error) {
      console.error(error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: "Failed to track visitor",
      },
      {
        status: 500,
      }
    );
  }
}