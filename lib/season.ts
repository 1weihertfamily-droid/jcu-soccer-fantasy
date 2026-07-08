import { supabase } from "@/lib/supabase";

export async function getActiveSeason() {
  const { data, error } = await supabase
    .from("seasons")
    .select("*")
    .eq("active", true)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("No active season found.");
  }

  return data;
}