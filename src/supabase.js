
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nbevbapnbahiaabqnjio.supabase.co";
const supabaseKey = "sb_publishable_2hVoMxFbFx0BLGfW_c5DLw_yPmFVs5C";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);

