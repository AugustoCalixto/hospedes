import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Arquivo não enviado" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = path.extname(file.name) || ".jpg";
    const filename = `${Date.now()}${ext}`;
    const uploadDir = process.env.UPLOAD_DIR || "public/uploads";
    const fullDir = path.join(process.cwd(), uploadDir);

    await mkdir(fullDir, { recursive: true });
    await writeFile(path.join(fullDir, filename), buffer);

    const url = `/${uploadDir.replace("public/", "")}/${filename}`;
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: "Erro no upload" }, { status: 500 });
  }
}
