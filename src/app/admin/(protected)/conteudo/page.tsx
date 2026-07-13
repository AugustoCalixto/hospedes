import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/notifications";
import {
  updateSiteSettings,
  createReview,
  deleteReview,
} from "@/lib/admin-actions";
import { ContactSettingsFields } from "@/components/admin/contact-settings-fields";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default async function AdminContentPage() {
  const [settings, reviews] = await Promise.all([
    getSiteSettings(),
    prisma.review.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-bold">Conteúdo</h1>
        <p className="mt-2 text-stone-600">Edite textos do site e avaliações</p>
      </div>

      <section className="rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="text-lg font-semibold">Configurações gerais</h2>
        <form action={updateSiteSettings} className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="siteName">Nome do site</Label>
            <Input id="siteName" name="siteName" defaultValue={settings.siteName} required />
          </div>
          <div>
            <Label htmlFor="notificationEmail">E-mail notificações</Label>
            <Input id="notificationEmail" name="notificationEmail" defaultValue={settings.notificationEmail || ""} />
          </div>
          <div>
            <Label htmlFor="homeHeroTitle">Título hero</Label>
            <Input id="homeHeroTitle" name="homeHeroTitle" defaultValue={settings.homeHeroTitle} required />
          </div>
          <div>
            <Label htmlFor="homeHeroSubtitle">Subtítulo hero</Label>
            <Input id="homeHeroSubtitle" name="homeHeroSubtitle" defaultValue={settings.homeHeroSubtitle} required />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="aboutTitle">Título sobre</Label>
            <Input id="aboutTitle" name="aboutTitle" defaultValue={settings.aboutTitle} required />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="aboutContent">Conteúdo sobre</Label>
            <Textarea id="aboutContent" name="aboutContent" rows={6} defaultValue={settings.aboutContent} />
          </div>
          <ContactSettingsFields
            contactPhone={settings.contactPhone}
            contactWhatsapp={settings.contactWhatsapp}
          />
          <div>
            <Label htmlFor="contactEmail">E-mail contato</Label>
            <Input id="contactEmail" name="contactEmail" defaultValue={settings.contactEmail || ""} />
          </div>
          <div>
            <Label htmlFor="contactAddress">Endereço</Label>
            <Input id="contactAddress" name="contactAddress" defaultValue={settings.contactAddress || ""} />
          </div>
          <div>
            <Label htmlFor="mapLat">Latitude mapa</Label>
            <Input id="mapLat" name="mapLat" type="number" step="any" defaultValue={settings.mapLat ?? ""} />
          </div>
          <div>
            <Label htmlFor="mapLng">Longitude mapa</Label>
            <Input id="mapLng" name="mapLng" type="number" step="any" defaultValue={settings.mapLng ?? ""} />
          </div>
          <div className="md:col-span-2">
            <Button type="submit">Salvar configurações</Button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="text-lg font-semibold">Avaliações</h2>
        <form action={createReview} className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="guestName">Nome</Label>
            <Input id="guestName" name="guestName" required />
          </div>
          <div>
            <Label htmlFor="rating">Nota (1-5)</Label>
            <Input id="rating" name="rating" type="number" min={1} max={5} defaultValue={5} required />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="content">Depoimento</Label>
            <Textarea id="content" name="content" rows={3} required />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" />
            Publicar na home
          </label>
          <div>
            <Button type="submit">Adicionar avaliação</Button>
          </div>
        </form>

        <ul className="mt-8 space-y-4">
          {reviews.map((review) => (
            <li key={review.id} className="flex items-start justify-between border-b border-stone-100 pb-4">
              <div>
                <p className="font-medium">{review.guestName} — {review.rating}/5</p>
                <p className="text-sm text-stone-600">{review.content}</p>
                <p className="text-xs text-stone-400">
                  {review.published ? "Publicado" : "Rascunho"}
                </p>
              </div>
              <form action={deleteReview.bind(null, review.id)}>
                <Button type="submit" size="sm" variant="ghost">Excluir</Button>
              </form>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
