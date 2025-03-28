import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABSE_API_URL || "";
const supabaseKey = process.env.SUPABSE_PUBLIC_API_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseKey);
