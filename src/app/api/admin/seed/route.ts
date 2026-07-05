import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { MOCK_DAYS } from "@/data/mockDays";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  const expectedSecret = process.env.ADMIN_SEED_SECRET || "admin-seed-secret";

  if (secret !== expectedSecret) {
    return NextResponse.json(
      { error: "Unauthorized. Invalid secret key." },
      { status: 401 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: "Supabase environment variables are missing." },
      { status: 500 }
    );
  }

  // Create an administrative Supabase client that bypasses RLS
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  });

  try {
    console.log("Starting database seeding...");

    // 1. Delete all existing days (cascades to problems)
    const { error: deleteError } = await supabase
      .from("days")
      .delete()
      .neq("id", 0);

    if (deleteError) {
      throw new Error(`Failed to clear existing days: ${deleteError.message}`);
    }

    // 2. Prepare days for bulk insertion
    const daysToInsert = MOCK_DAYS.map((day) => ({
      id: day.id,
      day_number: day.id,
      date_label: day.date || `Day ${day.id}`,
      pattern: day.pattern,
      topic: day.topic,
      youtube_id: day.youtubeId || null,
      notes_default: "",
    }));

    // 3. Bulk insert days
    const { error: daysError } = await supabase
      .from("days")
      .insert(daysToInsert);

    if (daysError) {
      throw new Error(`Failed to insert days: ${daysError.message}`);
    }

    // 4. Prepare problems for bulk insertion
    const problemsToInsert: any[] = [];
    MOCK_DAYS.forEach((day) => {
      if (day.problems && day.problems.length > 0) {
        day.problems.forEach((prob, index) => {
          problemsToInsert.push({
            day_id: day.id,
            name: prob.name,
            difficulty: prob.difficulty === "Medium" || prob.difficulty === "Hard" ? prob.difficulty : "Easy",
            leetcode_url: prob.leetcodeUrl || null,
            gfg_url: prob.gfgUrl || null,
            youtube_url: prob.youtubeUrl || null,
            is_missing_video: !!prob.isMissingVideo,
            order_index: index,
          });
        });
      }
    });

    // 5. Bulk insert problems
    const { error: problemsError } = await supabase
      .from("problems")
      .insert(problemsToInsert);

    if (problemsError) {
      throw new Error(`Failed to insert problems: ${problemsError.message}`);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${daysToInsert.length} days and ${problemsToInsert.length} problems.`,
    });
  } catch (error: any) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during seeding." },
      { status: 500 }
    );
  }
}
