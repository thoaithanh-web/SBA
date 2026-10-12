import { test, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import type { Orchid } from "../src/types";

const api = process.env.TEST_API_URL || "http://localhost:8080/orchids";
const prefix = "LAB05-E2E-";

test.afterEach(async ({ request }) => {
  const response = await request.get(api);
  expect(response.ok()).toBeTruthy();
  const orchids: Orchid[] = await response.json();
  for (const orchid of orchids.filter((item) =>
    item.orchidName.startsWith(prefix),
  )) {
    await request.delete(`${api}/${orchid.orchidId}`);
  }
});

test("UI create, detail, edit, refresh and delete reach the real API", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Bộ sưu tập hoa lan" }),
  ).toBeVisible();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Thêm hoa lan" })
    .click();
  await page.getByLabel("Tên hoa lan").fill(prefix + "Lan hồ điệp");
  await page.getByLabel("Phân loại", { exact: true }).fill("Phalaenopsis");
  await page
    .getByLabel("URL hình ảnh")
    .fill("http://localhost:5173/images/hoalan1.jpg");
  await page
    .getByLabel("Mô tả", { exact: true })
    .fill("Hoa lan tiếng Việt.\nMột câu chuyện mới.");
  await page.getByLabel("Hoa lan tự nhiên").check();
  const createdPromise = page.waitForResponse(
    (response) =>
      response.url() === api && response.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Lưu hoa lan" }).click();
  const created = await createdPromise;
  expect(created.status()).toBe(201);
  const orchid: Orchid = await created.json();
  await expect(page.getByTestId(`orchid-${orchid.orchidId}`)).toContainText(
    "Phalaenopsis",
  );
  await page
    .getByRole("link", { name: orchid.orchidName, exact: true })
    .click();
  await expect(page).toHaveURL(new RegExp(`/orchids/${orchid.orchidId}$`));
  await expect(
    page.getByRole("heading", { name: orchid.orchidName, exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Hoa lan tiếng Việt.", { exact: false }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: orchid.orchidName, exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Chỉnh sửa hoa lan" }).click();
  await expect(page.getByLabel("Tên hoa lan")).toHaveValue(orchid.orchidName);
  await page.getByLabel("Tên hoa lan").fill(prefix + "Lan đã cập nhật");
  await page.getByLabel("Hoa lan tự nhiên").uncheck();
  await page.getByLabel("Đánh dấu nổi bật").check();
  const updatedPromise = page.waitForResponse(
    (response) =>
      response.url() === `${api}/${orchid.orchidId}` &&
      response.request().method() === "PUT",
  );
  await page.getByRole("button", { name: "Lưu hoa lan" }).click();
  expect((await updatedPromise).status()).toBe(200);
  await page.reload();
  const row = page.getByTestId(`orchid-${orchid.orchidId}`);
  await expect(row).toContainText(prefix + "Lan đã cập nhật");
  await expect(row).toContainText("Nhân giống");
  await expect(row).toContainText("Nổi bật");
  await row.getByRole("button", { name: "Xóa" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Hủy" }).click();
  await expect(row).toBeVisible();
  await row.getByRole("button", { name: "Xóa" }).click();
  const deletedPromise = page.waitForResponse(
    (response) =>
      response.url() === `${api}/${orchid.orchidId}` &&
      response.request().method() === "DELETE",
  );
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Xóa hoa lan" })
    .click();
  expect((await deletedPromise).status()).toBe(204);
  await expect(row).toHaveCount(0);
  expect((await request.get(`${api}/${orchid.orchidId}`)).status()).toBe(404);
});

test("whitespace name is rejected without a POST and cancel does not save", async ({
  page,
  request,
}) => {
  const before: Orchid[] = await (await request.get(api)).json();
  let posts = 0;
  page.on("request", (req) => {
    if (req.url() === api && req.method() === "POST") posts++;
  });
  await page.goto("/orchids/new");
  await page.getByLabel("Tên hoa lan").fill("   ");
  await page.getByRole("button", { name: "Lưu hoa lan" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Tên hoa lan không được để trống",
  );
  expect(posts).toBe(0);
  await page.getByLabel("Tên hoa lan").fill(prefix + "Unsaved");
  await page.getByRole("link", { name: "Hủy", exact: true }).click();
  await expect(page).toHaveURL("http://localhost:5173/");
  const after: Orchid[] = await (await request.get(api)).json();
  expect(after.length).toBe(before.length);
});

test("missing and invalid detail/edit IDs show clear errors", async ({
  page,
}) => {
  await page.goto("/orchids/2147483647");
  await expect(page.getByRole("alert")).toContainText("Không tìm thấy hoa lan");
  await page.goto("/orchids/abc");
  await expect(page.getByRole("alert")).toContainText(
    "Mã hoa lan không hợp lệ",
  );
  await page.goto("/orchids/2147483647/edit");
  await expect(page.getByRole("alert")).toContainText("Không tìm thấy hoa lan");
  await page.goto("/orchids/0/edit");
  await expect(page.getByRole("alert")).toContainText(
    "Mã hoa lan không hợp lệ",
  );
});

test("search normalizes input and clearing search restores the collection", async ({
  page,
  request,
}) => {
  const created: Orchid = await (
    await request.post(api, {
      data: {
        orchidName: prefix + "Search specimen",
        orchidCategory: "Rare category",
      },
    })
  ).json();
  await page.goto("/");
  await expect(page.getByTestId(`orchid-${created.orchidId}`)).toBeVisible();
  await page
    .getByRole("textbox", { name: "Tìm hoa lan" })
    .fill("   RARE CATEGORY   ");
  await expect(page.getByTestId(`orchid-${created.orchidId}`)).toBeVisible();
  await page
    .getByRole("textbox", { name: "Tìm hoa lan" })
    .fill("no-match-999999");
  await expect(
    page.getByRole("heading", { name: "Không tìm thấy hoa lan" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Xóa tìm kiếm" }).click();
  await expect(page.getByTestId(`orchid-${created.orchidId}`)).toBeVisible();
});

test("network failure shows retry and recovers without fake data", async ({
  page,
}) => {
  await page.route(api, (route) => route.abort("connectionrefused"));
  await page.goto("/");
  await expect(page.getByRole("alert")).toContainText(
    "Không thể kết nối đến máy chủ",
  );
  await page.unroute(api);
  await page.getByRole("button", { name: "Thử lại" }).click();
  await expect(page.getByRole("alert")).toHaveCount(0);
  await expect(page.getByText(/Hiển thị \d+ \/ \d+ hoa lan/)).toBeVisible();
});

test("failed save preserves the form for retry", async ({ page }) => {
  await page.route(api, (route) =>
    route.request().method() === "POST"
      ? route.fulfill({
          status: 500,
          contentType: "application/json",
          body: "{}",
        })
      : route.continue(),
  );
  await page.goto("/orchids/new");
  await page.getByLabel("Tên hoa lan").fill(prefix + "Retry specimen");
  await page.getByRole("button", { name: "Lưu hoa lan" }).click();
  await expect(page.getByRole("alert")).toContainText("HTTP 500");
  await expect(page.getByLabel("Tên hoa lan")).toHaveValue(
    prefix + "Retry specimen",
  );
  await page.unroute(api);
  await page.getByRole("button", { name: "Lưu hoa lan" }).click();
  await expect(page).toHaveURL("http://localhost:5173/");
  await expect(
    page.getByRole("link", { name: prefix + "Retry specimen", exact: true }),
  ).toBeVisible();
});

test("list, detail and create work on mobile without document overflow", async ({
  page,
  request,
}) => {
  const created: Orchid = await (
    await request.post(api, {
      data: {
        orchidName: prefix + "Mobile specimen",
        orchidURL: "https://example.invalid/missing.jpg",
      },
    })
  ).json();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByTestId(`orchid-${created.orchidId}`)).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page
    .getByRole("link", { name: created.orchidName, exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: created.orchidName, exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Thêm hoa lan" })
    .click();
  await expect(page.getByLabel("Tên hoa lan")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("capture actual UI evidence and browser CORS response", async ({
  page,
}) => {
  await mkdir("../docs/evidence", { recursive: true });
  const responsePromise = page.waitForResponse(
    (response) =>
      response.url() === api && response.request().method() === "GET",
  );
  await page.goto("/");
  const response = await responsePromise;
  expect(response.status()).toBe(200);
  expect(response.headers()["access-control-allow-origin"]).toBe(
    "http://localhost:5173",
  );
  await expect(page.getByText(/Hiển thị \d+ \/ \d+ hoa lan/)).toBeVisible();
  await page.screenshot({
    path: "../docs/evidence/01-collection.png",
    fullPage: true,
  });
  const first = page.locator(".orchid-name").first();
  if (await first.count()) {
    await first.click();
    await expect(page.locator(".detail-card")).toBeVisible();
    await page.screenshot({
      path: "../docs/evidence/02-detail.png",
      fullPage: true,
    });
  }
  await page.goto("/orchids/new");
  await expect(page.getByLabel("Tên hoa lan")).toBeVisible();
  await page.screenshot({
    path: "../docs/evidence/03-form.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByText(/Hiển thị \d+ \/ \d+ hoa lan/)).toBeVisible();
  await page.screenshot({
    path: "../docs/evidence/04-mobile.png",
    fullPage: true,
  });
});
