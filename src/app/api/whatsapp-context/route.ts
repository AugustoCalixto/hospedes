import { NextRequest, NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/notifications";
import { resolveWhatsAppContext } from "@/lib/whatsapp-context";
import {
  buildWhatsAppLink,
  buildWhatsAppMessage,
  resolveWhatsAppPhone,
} from "@/lib/whatsapp";

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path") || "/";
  const settings = await getSiteSettings();
  const ctx = await resolveWhatsAppContext(path, settings.siteName);
  const message = buildWhatsAppMessage(ctx);
  const href = buildWhatsAppLink(resolveWhatsAppPhone(settings.contactWhatsapp), message);

  return NextResponse.json({ href, message });
}
