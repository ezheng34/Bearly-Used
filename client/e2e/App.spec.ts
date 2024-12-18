import { expect, test } from "@playwright/test";
import { setupClerkTestingToken, clerk } from "@clerk/testing/playwright";
import "dotenv/config";
import path from "path";

/* 
 * NOTE: this runs assuming hello@brown.edu is in the database. If not, 
 * run Signup.spec.ts first 
 * 
 * RUN THIS WITHOUT PARALLELISM SINCE IT CREATES PROBLEMS: 
 * npx playwright test App.spec.ts --workers=1
 */

const url = "http://localhost:8000";

test.use({
  bypassCSP: true,
});

test.beforeEach(async ({ page }) => {
  await page.goto(url);

  // sign-in if needed
  const signInButton = page.getByRole("button", { name: "Sign in" });
  const signOutButton = page.getByRole("button", { name: "Sign out" });

  await Promise.race([
    signInButton.waitFor({ timeout: 5000 }),
    signOutButton.waitFor({ timeout: 5000 }),
  ]);

  const isSignedOut = await signInButton.isVisible().catch(() => false);

  if (isSignedOut) {
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.getByLabel("Email address").click();
    await page.getByLabel("Email address").fill("hello@brown.edu");
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await page.getByLabel("Password", { exact: true }).click();
    await page.getByLabel("Password", { exact: true }).fill("HelloGuys123!!");
    await page.getByRole("button", { name: "Continue" }).click();
  }
});

/* Sign in */
test("Everything loads on sign in", async ({ page }) => {
  await expect(page.locator("a.navbar-brand")).toBeVisible();
  await expect(page.locator("div.homepage-listings")).toBeVisible();
  await expect(page.locator("button.create-listing")).toBeVisible();
  await expect(page.locator("div.user-profile-section")).toBeVisible();
});

/* Page switching */
test("Switching between pages loads correctly", async ({ page }) => {
  await page.locator("a.user-name").click();
  await expect(page.locator("div.profile")).toBeVisible();
  await expect(page.locator("div.listings-navigation")).toBeVisible();
  await expect(page.locator("button.edit-profile")).toBeVisible();
  await expect(page.locator("button.create-listing")).toBeVisible();
  await expect(page.locator("h2.name")).toHaveText("Student");
  await expect(page.locator("p.school")).toHaveText("School: Brown");
  await expect(page.locator("p.email")).toHaveText("Email: hello@brown.edu");
  await expect(page.locator("p.phone")).toHaveText(
    "Phone Number: 216-222-2121"
  );
  await page.locator("a.back-link").click();
  await expect(page.locator("a.navbar-brand")).toBeVisible();
  await expect(page.locator("div.homepage-listings")).toBeVisible();
  await expect(page.locator("button.create-listing")).toBeVisible();
  await expect(page.locator("div.user-profile-section")).toBeVisible();
});

/* Creating and deleting a listing */
test("Creating and deleting a listing works properly", async ({ page }) => {
  await page.locator("button.create-listing").click();

  const uniqueTitle = `Test Item ${Date.now()}`; 
  await page.locator('input[name="title"]').fill(uniqueTitle);
  
  await page
    .locator('textarea[name="description"]')
    .fill("Description");
  await page.locator('input[name="price"]').fill("4.00");
  await page
    .locator('select[name="category"]')
    .selectOption({ label: "Other" });
  await page.locator('select[name="condition"]').selectOption({ label: "New" });
  await page.locator('input[name="tags"]').fill("test tag1");
  await page.locator('input[name="tags"]').press("Enter");
  await page.locator('input[name="tags"]').fill("test tag2");
  await page.locator('input[name="tags"]').press("Enter");
  await page
    .locator('input[type="file"][accept="image/*"]')
    .setInputFiles("./dummy.png");
  await page.locator("button.btn.btn-submit.w-100").click();
  await page.waitForTimeout(2000);

  // Search for it and make sure its there!
  await page.getByPlaceholder("Search listings by title or tags...").fill(uniqueTitle); 
  await page.keyboard.press("Enter"); 
  await page.waitForTimeout(2000);
  await expect(page.getByText(uniqueTitle)).toBeVisible(); 

  // verify it has the correct information 
  await page.getByText(uniqueTitle).click();
  await expect(page.getByText("test tag1")).toBeVisible(); 
  await expect(page.getByText("test tag2")).toBeVisible(); 
  await expect(page.getByText("$4")).toBeVisible(); 

  // Delete the item 
  await page.getByText("Delete listing", {exact: true}).click(); 
  await expect(page.getByText("Are you sure you want to delete this listing? This action cannot be undone.")).toBeVisible(); 
  await page.locator("#confirm-delete-listing").click(); 
  await page.waitForTimeout(2000);

  // Search for it and make sure its not sure its not there! 
  await page.goto(url);
  await page.getByPlaceholder("Search listings by title or tags...").fill(uniqueTitle); 
  await page.keyboard.press("Enter"); 
  await page.waitForTimeout(2000);

  await expect(page.getByText("No Items Found")).toBeVisible();
});

/* Edit listing */



