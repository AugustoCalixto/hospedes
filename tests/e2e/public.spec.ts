import { test, expect } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("accommodations listing loads", async ({ page }) => {
  await page.goto("/acomodacoes");
  await expect(page.getByRole("heading", { name: "Acomodações" })).toBeVisible();
});

test("contact page loads", async ({ page }) => {
  await page.goto("/contato");
  await expect(page.getByRole("heading", { name: "Contato" })).toBeVisible();
});

test("admin login page loads", async ({ page }) => {
  await page.goto("/admin/login");
  await expect(page.getByRole("heading", { name: "Área Administrativa" })).toBeVisible();
});
