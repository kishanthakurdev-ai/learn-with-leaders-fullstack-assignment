import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { application_id } = await req.json();

  if (!application_id) {
    return new Response(
      JSON.stringify({ error: "application_id is required" }),
      { status: 400 }
    );
  }

  // 1️⃣ Approve application
  const { data: application, error } = await supabase
    .from("applications")
    .update({ status: "approved" })
    .eq("id", application_id)
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }

  // 2️⃣ Create enrollment
  await supabase.from("enrollments").insert({
    program_id: application.program_id,
    student_id: application.student_id,
  });

  return new Response(
    JSON.stringify({
      message: "Application approved and enrollment created",
    }),
    { headers: { "Content-Type": "application/json" } }
  );
});