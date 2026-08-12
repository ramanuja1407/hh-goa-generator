import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
);

export async function saveBuilderProfile({
  builderId,
  name,
  stack,
  photoUrl,
}) {
  const { data, error } = await supabase
    .from("builder_profiles")
    .upsert(
      {
        builder_id: builderId,
        name,
        stack,
        photo_url: photoUrl,
      },
      {
        onConflict: "builder_id",
      }
    )
    .select()
    .single();

  if (error) {
    console.error("Supabase save error:", error);
    throw error;
  }

  return data;
}

export async function getBuilderProfile(builderId) {
  const { data, error } = await supabase
    .from("builder_profiles")
    .select("*")
    .eq("builder_id", builderId)
    .maybeSingle();

  if (error) {
    console.error("Supabase fetch error:", error);
    throw error;
  }

  return data;
}