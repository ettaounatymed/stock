import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const supabaseResponse = createClient(request);

  await supabaseResponse.headers;

  return supabaseResponse;
}

export const config = {
  matcher: ["/"],
};
