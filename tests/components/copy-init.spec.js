/**
 * src/utils/copy-init.js — 0.2.2 regressions.
 *
 * - Feedback events are namespaced `vb:copy` / `vb:paste`; the old
 *   synthetic bubbling `copy` / `paste` CustomEvents broke page-level
 *   native ClipboardEvent handlers that read `e.clipboardData`.
 * - The announcement goes to one persistent, visually hidden live region
 *   on <body>, not inside the button, so the button's accessible name
 *   doesn't change.
 * - 0.3.0: while a modal <dialog> is open the rest of the page is inert,
 *   so the announcement goes to a region inside the open modal instead.
 *
 * copy-init ships in the bundle (review-surface imports it), so any demo
 * page that loads the pack auto-enhances [data-copy] buttons.
 */

import { test, expect } from '@playwright/test';

const demoPage = 'demos/review-surface-basic/';

test.describe('copy-init', () => {
  test.beforeEach(async ({ context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  });

  test('copy fires vb:copy (not a synthetic native-named copy) and keeps the button name', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('review-surface[data-upgraded]');

    await page.evaluate(() => {
      window.__events = [];
      window.__errors = [];
      // A typical page-level native handler: throws on a synthetic event.
      document.addEventListener('copy', (e) => {
        try { e.clipboardData.getData('text/plain'); window.__events.push('copy'); }
        catch (err) { window.__errors.push(String(err)); }
      });
      document.addEventListener('paste', () => window.__events.push('paste'));
      document.addEventListener('vb:copy', (e) => window.__events.push(['vb:copy', e.detail.text]));
      document.addEventListener('vb:paste', (e) => window.__events.push(['vb:paste', e.detail.text]));

      const btn = document.createElement('button');
      btn.id = 'copy-btn';
      btn.dataset.copy = 'npm install vanilla-breeze';
      btn.textContent = 'Copy';
      const input = document.createElement('input');
      input.id = 'paste-dest';
      input.setAttribute('aria-label', 'Paste destination');
      const paste = document.createElement('button');
      paste.id = 'paste-btn';
      paste.dataset.pasteTarget = '#paste-dest';
      paste.textContent = 'Paste';
      document.body.append(btn, input, paste);
    });

    const copyBtn = page.locator('#copy-btn');
    await expect(copyBtn).toHaveAttribute('data-copy-init', '');
    await copyBtn.click();
    await expect(copyBtn).toHaveAttribute('data-state', 'copied');

    const region = page.locator('body > [data-vb-clipboard-status]');
    await expect(region).toHaveText('Copied to clipboard');
    await expect(region).toHaveAttribute('aria-live', 'polite');

    // The button is untouched: no injected children, same accessible name.
    expect(await copyBtn.evaluate(b => b.children.length)).toBe(0);
    await expect(page.getByRole('button', { name: 'Copy', exact: true })).toHaveCount(1);

    await page.locator('#paste-btn').click();
    await expect(page.locator('#paste-dest')).toHaveValue('npm install vanilla-breeze');
    await expect(region).toHaveText('Pasted from clipboard');
    await expect(page.getByRole('button', { name: 'Paste', exact: true })).toHaveCount(1);

    // Still one region after two announcements.
    expect(await page.locator('[data-vb-clipboard-status]').count()).toBe(1);

    const { events, errors } = await page.evaluate(() => ({ events: window.__events, errors: window.__errors }));
    expect(errors).toEqual([]);
    expect(events).toEqual([
      ['vb:copy', 'npm install vanilla-breeze'],
      ['vb:paste', 'npm install vanilla-breeze'],
    ]);
  });
  test('inside a showModal() dialog the announcement lands in a region inside the dialog', async ({ page }) => {
    await page.goto(demoPage);
    await page.waitForSelector('review-surface[data-upgraded]');

    await page.evaluate(() => {
      const dialog = document.createElement('dialog');
      dialog.id = 'modal';
      dialog.setAttribute('aria-label', 'Share');
      const btn = document.createElement('button');
      btn.id = 'dialog-copy';
      btn.dataset.copy = 'https://example.test/share';
      btn.textContent = 'Copy link';
      dialog.append(btn);
      document.body.append(dialog);
      dialog.showModal();
    });

    await page.locator('#dialog-copy').click();
    const inDialog = page.locator('#modal > [data-vb-clipboard-status]');
    await expect(inDialog).toHaveText('Copied to clipboard');
    await expect(inDialog).toHaveAttribute('role', 'status');
    // Nothing went to the (inert) body region.
    await expect(page.locator('body > [data-vb-clipboard-status]')).toHaveCount(0);

    // A second copy reuses the dialog's region.
    await page.locator('#dialog-copy').click();
    await expect(page.locator('#modal [data-vb-clipboard-status]')).toHaveCount(1);

    // Once the dialog closes, announcements fall back to <body>.
    await page.evaluate(() => document.getElementById('modal').close());
    await page.evaluate(() => {
      const btn = document.createElement('button');
      btn.id = 'page-copy';
      btn.dataset.copy = 'page';
      btn.textContent = 'Copy page';
      document.body.append(btn);
    });
    await page.locator('#page-copy').click();
    await expect(page.locator('body > [data-vb-clipboard-status]')).toHaveText('Copied to clipboard');
  });
});
