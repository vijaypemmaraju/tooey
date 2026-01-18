/**
 * docsite playwright e2e tests
 *
 * tests the documentation site in a real browser to catch runtime errors
 */

import { test, expect } from '@playwright/test';

test.describe('docsite loading', () => {
  test('page loads without JavaScript errors', async ({ page }) => {
    const errors: string[] = [];

    // capture console errors (ignore network/CDN errors)
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // ignore CDN/network errors that don't affect functionality
        if (!text.includes('net::ERR_') &&
            !text.includes('Failed to load resource') &&
            !text.includes('tailwind is not defined')) {
          errors.push(text);
        }
      }
    });

    // capture page errors (uncaught exceptions)
    page.on('pageerror', err => {
      // ignore tailwind not defined (CDN issue, not our code)
      if (!err.message.includes('tailwind is not defined')) {
        errors.push(err.message);
      }
    });

    // navigate to docsite
    await page.goto('/');

    // wait for the app to render (should not stay on "loading...")
    // the #app element should have content after JS executes
    await expect(page.locator('#app')).not.toBeEmpty({ timeout: 10000 });

    // verify no JavaScript errors occurred (excluding CDN issues)
    expect(errors, `JavaScript errors: ${errors.join(', ')}`).toHaveLength(0);
  });

  test('sidebar navigation renders', async ({ page }) => {
    await page.goto('/');

    // wait for sidebar to be visible
    const sidebar = page.locator('#sidebar');
    await expect(sidebar).toBeVisible({ timeout: 10000 });

    // verify navigation buttons exist
    const navButtons = page.locator('.nav-btn');
    await expect(navButtons).toHaveCount(15, { timeout: 5000 }); // 15 pages
  });

  test('page content renders after navigation', async ({ page }) => {
    await page.goto('/');

    // wait for initial load
    await expect(page.locator('#sidebar')).toBeVisible({ timeout: 10000 });

    // click on a navigation item
    await page.locator('.nav-btn').first().click();

    // verify page content updates
    const pageContent = page.locator('#page-content');
    await expect(pageContent).not.toBeEmpty({ timeout: 5000 });
  });

  test('search input is functional', async ({ page }) => {
    await page.goto('/');

    // wait for search input
    const searchInput = page.locator('#search');
    await expect(searchInput).toBeVisible({ timeout: 10000 });

    // type in search
    await searchInput.fill('render');

    // search results should appear
    const searchResults = page.locator('#search-results');
    await expect(searchResults).not.toBeEmpty({ timeout: 5000 });
  });

  test('theme toggle works', async ({ page }) => {
    await page.goto('/');

    // wait for theme button
    const themeBtn = page.locator('#theme-btn');
    await expect(themeBtn).toBeVisible({ timeout: 10000 });

    // get initial background color
    const initialBg = await page.evaluate(() =>
      getComputedStyle(document.body).getPropertyValue('--bg').trim()
    );

    // click theme toggle
    await themeBtn.click();

    // background should change
    const newBg = await page.evaluate(() =>
      getComputedStyle(document.body).getPropertyValue('--bg').trim()
    );

    expect(newBg).not.toBe(initialBg);
  });

  test('modules load correctly (no import errors)', async ({ page }) => {
    const moduleErrors: string[] = [];

    // capture module loading errors specifically
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('Failed to resolve module') ||
          text.includes('does not provide an export') ||
          text.includes('cannot be found')) {
        moduleErrors.push(text);
      }
    });

    page.on('pageerror', err => {
      if (err.message.includes('import') || err.message.includes('module')) {
        moduleErrors.push(err.message);
      }
    });

    await page.goto('/');

    // wait for app to load
    await expect(page.locator('#app')).not.toBeEmpty({ timeout: 10000 });

    // no module errors should have occurred
    expect(moduleErrors, `Module errors: ${moduleErrors.join(', ')}`).toHaveLength(0);
  });
});
