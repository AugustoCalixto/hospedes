import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Building2,
  ClipboardList,
  MapPin,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/acomodacoes", label: "Acomodações", icon: Building2 },
  { href: "/admin/cidades", label: "Cidades", icon: MapPin },
  { href: "/admin/reservas", label: "Reservas", icon: ClipboardList },
  { href: "/admin/calendario", label: "Calendário", icon: Calendar },
  { href: "/admin/conteudo", label: "Conteúdo", icon: FileText },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 flex-col border-r border-stone-200 bg-white md:flex">
        <div className="border-b border-stone-200 p-6">
          <Link href="/admin" className="font-bold text-emerald-800">
            Admin
          </Link>
          <p className="mt-1 text-xs text-stone-500">{session.user?.email}</p>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-stone-600 hover:bg-stone-100 hover:text-emerald-800"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-stone-600 hover:bg-stone-100"
          >
            <Home className="h-4 w-4" />
            Ver site
          </Link>
        </nav>
        <div className="border-t border-stone-200 p-4">
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <Button type="submit" variant="ghost" className="w-full justify-start">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </form>
        </div>
      </aside>
      <main className="flex-1 bg-stone-50 p-6 md:p-8">{children}</main>
    </div>
  );
}
