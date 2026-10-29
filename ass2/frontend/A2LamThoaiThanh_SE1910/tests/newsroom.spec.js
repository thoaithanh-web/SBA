// Author: Lam Thoai Thanh - CE190169
import { test, expect } from "@playwright/test";
import fs from "node:fs";
const API = "http://localhost:8082/api";
const password = "Demo123!";
let admin, staff, account, category, article;
const prefix = "E2E-" + Date.now();
async function call(ctx, method, path, data) {
  const headers = {};
  if (method !== "GET") {
    const token = await (await ctx.get(API + "/auth/csrf")).json();
    headers[token.headerName] = token.token;
  }
  const response = await ctx.fetch(API + path, { method, data, headers });
  expect(
    response.ok(),
    method + " " + path + ": " + (await response.text()),
  ).toBeTruthy();
  return response.status() === 204 ? null : response.json();
}
async function login(
  page,
  email = "EmmaWilliam@FUNewsManagement.org",
  pass = "@1",
) {
  await page.goto("/login");
  await page.getByLabel("Email address", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(pass);
  await page.getByRole("button", { name: "Sign in →" }).click();
  await expect(page).toHaveURL(/workspace/);
}
async function search(page, text) {
  await page.getByRole("textbox", { name: "Search records" }).fill(text);
  await page.getByRole("button", { name: "Search", exact: true }).click();
}
async function shot(page, name) {
  if (process.env.CAPTURE_EVIDENCE) {
    fs.mkdirSync("../../docs/evidence", { recursive: true });
    await page.screenshot({
      path: "../../docs/evidence/" + name + ".png",
      fullPage: true,
    });
  }
}
test.beforeAll(async ({ playwright }) => {
  admin = await playwright.request.newContext();
  await call(admin, "POST", "/auth/login", {
    email: "SteveParis@FUNewsManagement.org",
    password: "@1",
  });
  account = await call(admin, "POST", "/accounts", {
    accountName: prefix,
    accountEmail: prefix + "@test.local",
    accountRole: 2,
    password,
  });
  staff = await playwright.request.newContext();
  await call(staff, "POST", "/auth/login", {
    email: account.accountEmail,
    password,
  });
  category = await call(staff, "POST", "/categories", {
    categoryName: prefix,
    categoryDescription: "Mô tả thực nghiệm",
    active: true,
  });
});
test.afterAll(async () => {
  if (article) await call(staff, "DELETE", "/news/" + article.newsArticleId);
  if (category)
    await call(staff, "DELETE", "/categories/" + category.categoryId);
  if (account) await call(admin, "DELETE", "/accounts/" + account.accountId);
  await staff?.dispose();
  await admin?.dispose();
});
test("public articles, detail and search without login", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "The latest stories" }),
  ).toBeVisible();
  await expect(page.locator(".story-card").first()).toBeVisible();
  await shot(page, "public-desktop");
  await page.locator(".story-card").first().click();
  await expect(page).toHaveURL(/news\//);
  await expect(page.locator(".story-content")).toBeVisible();
  await page.goto("/");
  await page
    .getByRole("textbox", { name: "Search public news" })
    .fill("no-match-" + prefix);
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(
    page.getByText("No published stories match your search.", { exact: true }),
  ).toBeVisible();
});
test("empty and invalid login stays on form", async ({ page }) => {
  await page.goto("/login");
  await shot(page, "login-desktop");
  await page.getByRole("button", { name: "Sign in →" }).click();
  await expect(page.getByRole("alert")).toContainText("Enter your email");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("missing@test.local");
  await page.getByLabel("Password", { exact: true }).fill("wrong");
  await page.getByRole("button", { name: "Sign in →" }).click();
  await expect(page.getByRole("alert")).toContainText(/Invalid|incorrect/i);
  await expect(page).toHaveURL(/login/);
});
test("staff role, reload session and logout", async ({ page }) => {
  await login(page);
  await expect(
    page.getByRole("link", { name: "Accounts", exact: true }),
  ).toHaveCount(0);
  await page.goto("/workspace/accounts");
  await expect(page).toHaveURL(/workspace\/news/);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "News articles." }),
  ).toBeVisible();
  await shot(page, "staff-news");
  await page.getByRole("button", { name: /Sign out|Log out/ }).click();
  await expect(page).toHaveURL(/login/);
  await page.goto("/workspace/news");
  await expect(page).toHaveURL(/login/);
});
test("category popup create edit search cancel delete", async ({ page }) => {
  await login(page);
  await page.goto("/workspace/categories");
  await shot(page, "staff-categories");
  await page.getByRole("button", { name: /Add category|New category/ }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Category name").fill(prefix + "-UI");
  await dialog.locator("#field-categoryDescription").fill("Nội dung Unicode");
  await dialog.getByRole("button", { name: /Create category|Save/ }).click();
  await expect(dialog).not.toBeVisible();
  await search(page, prefix + "-UI");
  await page
    .getByRole("button", { name: "Edit " + prefix + "-UI", exact: true })
    .click();
  await dialog.locator("#field-categoryDescription").fill("Đã chỉnh sửa");
  await shot(page, "category-popup");
  await dialog.getByRole("button", { name: /Save/ }).click();
  await expect(page.getByText("Đã chỉnh sửa", { exact: true })).toBeVisible();
  await page
    .getByRole("button", { name: "Delete " + prefix + "-UI", exact: true })
    .click();
  await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page.getByText(prefix + "-UI", { exact: true })).toBeVisible();
  await page
    .getByRole("button", { name: "Delete " + prefix + "-UI", exact: true })
    .click();
  await dialog
    .getByRole("button", { name: "Delete category", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "No records found" }),
  ).toBeVisible();
});
test("news popup draft publish tags history and category guard", async ({
  page,
}) => {
  await login(page, account.accountEmail, password);
  await page.getByRole("button", { name: /Add article|New article/ }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Article title").fill(prefix + " story");
  await dialog.locator("#field-headline").fill("Headline for interview");
  await dialog
    .locator("#field-categoryId")
    .selectOption(String(category.categoryId));
  await dialog.getByLabel("Article content").fill("Tin tức bằng tiếng Việt");
  await dialog.locator("#field-tags").fill("Research, Student Life");
  await shot(page, "news-popup");
  await dialog.getByRole("button", { name: /Create article|Save/ }).click();
  await expect(dialog).not.toBeVisible();
  const list = await call(staff, "GET", "/news?keyword=" + prefix);
  article = list.content.find((x) => x.newsTitle === prefix + " story");
  expect(article).toBeTruthy();
  expect(article.tags).toHaveLength(2);
  const anon = await page.request.get(
    API + "/public/news/" + article.newsArticleId,
  );
  expect(anon.status()).toBe(404);
  await search(page, prefix);
  await page
    .getByRole("button", { name: "Edit " + prefix + " story", exact: true })
    .click();
  await dialog.getByLabel("Published", { exact: true }).check();
  await dialog.getByRole("button", { name: /Save/ }).click();
  await expect(dialog).not.toBeVisible();
  expect(
    (
      await page.request.get(API + "/public/news/" + article.newsArticleId)
    ).status(),
  ).toBe(200);
  await page.goto("/workspace/history");
  await expect(
    page.getByText(prefix + " story", { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /Edit .*story/ })).toHaveCount(
    0,
  );
  await shot(page, "staff-history");
  await page.goto("/workspace/categories");
  await search(page, prefix);
  await page
    .getByRole("button", { name: "Delete " + prefix, exact: true })
    .click();
  await dialog
    .getByRole("button", { name: "Delete category", exact: true })
    .click();
  await expect(dialog.getByRole("alert")).toContainText(/news|article/i);
  await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
  await page.goto("/workspace/news");
  await search(page, prefix);
  await page
    .getByRole("button", { name: "Delete " + prefix + " story", exact: true })
    .click();
  await dialog
    .getByRole("button", { name: "Delete article", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "No records found" }),
  ).toBeVisible();
  expect(
    (
      await page.request.get(API + "/public/news/" + article.newsArticleId)
    ).status(),
  ).toBe(404);
  article = null;
});
test("profile popup only changes current account", async ({ page }) => {
  await login(page, account.accountEmail, password);
  await page.goto("/workspace/profile");
  await page.getByRole("button", { name: "Edit profile" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByLabel("Role", { exact: true })).toHaveCount(0);
  await dialog.getByLabel("Full name").fill(prefix + " revised");
  await dialog.getByRole("button", { name: /Save/ }).click();
  await expect(
    page.getByRole("heading", { name: prefix + " revised" }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: prefix + " revised" }),
  ).toBeVisible();
  await shot(page, "staff-profile");
});
test("admin popup accounts CRUD and creator delete restriction", async ({
  page,
}) => {
  await login(page, "SteveParis@FUNewsManagement.org");
  await shot(page, "admin-accounts");
  await page.getByRole("button", { name: /Add account|New account/ }).click();
  const dialog = page.getByRole("dialog");
  const name = prefix + "-admin-ui";
  await dialog.getByLabel("Full name").fill(name);
  await dialog.locator("#field-accountEmail").fill(name + "@test.local");
  await dialog.locator("#field-password").fill(password);
  await dialog.getByRole("button", { name: /Create account|Save/ }).click();
  await expect(dialog).not.toBeVisible();
  await search(page, name);
  await page.getByRole("button", { name: "Edit " + name, exact: true }).click();
  await dialog.getByLabel("Full name").fill(name + " updated");
  await dialog.getByRole("button", { name: /Save/ }).click();
  await expect(dialog).not.toBeVisible();
  await page
    .getByRole("button", { name: "Delete " + name + " updated", exact: true })
    .click();
  await dialog
    .getByRole("button", { name: "Delete account", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "No records found" }),
  ).toBeVisible();
  await search(page, "Emma");
  await page.getByRole("button", { name: /Delete Emma/ }).click();
  await dialog
    .getByRole("button", { name: "Delete account", exact: true })
    .click();
  await expect(dialog.getByRole("alert")).toContainText(
    /created|news|article/i,
  );
});
test("network error can retry and recover", async ({ page }) => {
  await page.route("**/api/public/news?*", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ message: "Service unavailable" }),
    }),
  );
  await page.goto("/");
  await expect(page.getByRole("alert")).toContainText("Service unavailable");
  await page.unroute("**/api/public/news?*");
  await page.getByRole("button", { name: /Try again/ }).click();
  await expect(page.locator(".story-card").first()).toBeVisible();
});
test("mobile public and staff navigation fit viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".story-card").first()).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await shot(page, "public-mobile");
  await login(page);
  await expect(
    page.getByRole("heading", { name: "News articles." }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await shot(page, "staff-mobile");
});
