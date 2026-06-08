import { supabase } from "@/lib/supabase";

export default async function TestPage() {
  const { data, error } = await supabase
    .from("ballots")
    .select("*");

  return (
    <pre>
      {JSON.stringify(
        {
          error,
          data,
        },
        null,
        2
      )}
    </pre>
  );
}