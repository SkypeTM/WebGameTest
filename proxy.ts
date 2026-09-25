import { NextResponse, type NextRequest } from "next/server";

const portableUserAgent =
  /Android|iPhone|iPad|iPod|Mobile|Tablet|Silk|Kindle|PlayBook/i;

/** Redirect portable browsers to the independently addressable mobile shell. */
export function proxy(request: NextRequest) {
  const forcedMobile = request.nextUrl.searchParams.get("mobile") === "1";
  const forcedDesktop = request.nextUrl.searchParams.get("desktop") === "1";
  const userAgent = request.headers.get("user-agent") || "";

  if (forcedDesktop || (!forcedMobile && !portableUserAgent.test(userAgent))) {
    return NextResponse.next();
  }

  const destination = request.nextUrl.clone();
  destination.pathname = "/m";
  destination.searchParams.delete("mobile");
  return NextResponse.redirect(destination);
}

export const config = { matcher: "/" };
