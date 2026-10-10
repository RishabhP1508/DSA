import { expect, test } from '@playwright/test';

test('lesson playback pauses at its real checkpoint without revealing the answer', async ({page}) => {
  test.setTimeout(90_000);
  await page.goto('/');
  await page.getByRole('button',{name:'Learn',exact:true}).click();
  await page.locator('.lesson-list').getByRole('button',{name:/^Variables and Types /}).click();
  await page.getByRole('tab',{name:'Watch the code'}).click();
  await page.getByRole('button',{name:'▶ Run',exact:true}).click();
  await expect(page.getByText(/step \d+ \/ \d+ · completed/)).toBeVisible({timeout:60_000});
  const checkpoint=page.getByRole('button',{name:/Checkpoint 1 · step/});
  const text=await checkpoint.textContent();
  const step=Number(text?.match(/step (\d+)/)?.[1]);
  expect(step).toBeGreaterThan(1);
  await page.locator('.speed-control select').selectOption('4');
  await page.getByRole('button',{name:'▶ Play',exact:true}).click();
  await expect(page.getByText(new RegExp(`step ${step} /`))).toBeVisible({timeout:20_000});
  await expect(page.getByRole('button',{name:'▶ Play',exact:true})).toBeVisible();
  await expect(page.locator('.checkpoint-prompt')).toBeVisible();
  await expect(page.locator('.checkpoint-answer')).toHaveCount(0);
  await page.getByRole('button',{name:'Compare with the explanation'}).click();
  await expect(page.locator('.checkpoint-answer')).toBeVisible();
  await page.getByRole('button',{name:'▶ Play',exact:true}).click();
  await expect.poll(async()=>Number((await page.getByText(/step \d+ \/ \d+/).textContent())?.match(/step (\d+)/)?.[1])).toBeGreaterThan(step);
});
