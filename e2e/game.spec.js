import {test,expect} from '@playwright/test';
test('start, pause, resume, drop and restart a completed game',async({page})=>{
 await page.clock.install();
 await page.goto('/');
 await page.getByRole('button',{name:'Clock in & play'}).click();
 await expect(page.locator('#status')).toHaveText('ON THE CLOCK');
 await page.getByRole('button',{name:'Pause game'}).click();
 await expect(page.getByRole('heading',{name:'On a break.'})).toBeVisible();
 await page.getByRole('button',{name:'Back to work'}).click();
 await page.locator('body').click({position:{x:5,y:5}});
 await page.clock.runFor(550);
 await page.keyboard.press('Space');
 await expect(page.locator('#hours')).toHaveText('8h');
 await expect(page.locator('#shift')).toHaveText('SHIFT 01');
 for(let i=0;i<30;i++){if(await page.locator('#restart').count())break;await page.clock.runFor(137);await page.locator('#drop').click();}
 await expect(page.locator('#restart')).toBeVisible();
 await page.locator('#restart').click();
 await expect(page.locator('#hours')).toHaveText('0h');
 await expect(page.locator('#status')).toHaveText('ON THE CLOCK');
});
test('mobile layout and help work',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');
 await expect(page.getByRole('button',{name:'Clock in & play'})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.getByRole('button',{name:'How to play'}).click();
 await expect(page.getByRole('dialog')).toBeVisible();
 await page.getByRole('button',{name:'Close instructions'}).click();
 await expect(page.getByRole('dialog')).not.toBeVisible();
});

async function finishGame(page) {
 await page.clock.install();
 await page.goto('/');
 await page.getByRole('button',{name:'Clock in & play'}).click();
 await page.clock.runFor(550);
 await page.locator('#drop').click();
 for(let i=0;i<40;i++){
  if(await page.locator('#restart').count()) break;
  await page.clock.runFor(137);
  await page.locator('#drop').click();
 }
 await expect(page.locator('#restart')).toBeVisible();
}

test('final score invites sharing with accurate social links and copied score', async ({page}) => {
 await page.addInitScript(() => {
  Object.defineProperty(navigator, 'share', {value:undefined, configurable:true});
  Object.defineProperty(navigator, 'clipboard', {value:{writeText:async text => { window.copiedScore = text; }}, configurable:true});
 });
 await finishGame(page);
 const hours = await page.locator('#hours').textContent();
 await page.getByRole('button',{name:'Share your score'}).click();
 await expect(page.locator('#share-dialog')).toBeVisible();
 await expect(page.locator('#share-score')).toHaveText(`${hours} banked`);
 await expect(page.locator('#native-share')).toBeHidden();
 const text = await page.locator('#share-text').inputValue();
 expect(text).toContain(`${parseInt(hours)} hours`);
 expect(text).toContain('Clock Stack by WorkEasy Software');
 const x = new URL(await page.locator('#share-x').getAttribute('href'));
 expect(x.searchParams.get('text')).toBe(text.split('\n')[0]);
 expect(x.searchParams.get('url')).toBe('http://127.0.0.1:5173/');
 const facebook = new URL(await page.locator('#share-facebook').getAttribute('href'));
 expect(facebook.searchParams.get('u')).toBe('http://127.0.0.1:5173/');
 await page.getByRole('button',{name:'Copy score & link'}).click();
 expect(await page.evaluate(() => window.copiedScore)).toBe(text);
 await expect(page.locator('#share-status')).toContainText('Copied!');
 await page.keyboard.press('Escape');
 await expect(page.locator('#share-dialog')).not.toBeVisible();
 await expect(page.locator('#share-score-button')).toBeFocused();
 await page.locator('#restart').click();
 await expect(page.locator('#hours')).toHaveText('0h');
});

test('mobile sharing supports manual copy when clipboard is denied', async ({page}) => {
 await page.setViewportSize({width:320,height:640});
 await page.addInitScript(() => Object.defineProperty(navigator,'clipboard',{value:{writeText:async()=>{throw new Error('Denied');}},configurable:true}));
 await finishGame(page);
 await page.getByRole('button',{name:'Share your score'}).click();
 await page.getByRole('button',{name:'Copy score & link'}).click();
 await expect(page.locator('#share-status')).toContainText('Select and copy');
 expect(await page.locator('#share-text').evaluate(el => el.selectionEnd - el.selectionStart)).toBeGreaterThan(0);
 expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
 const bounds = await page.locator('#share-dialog').boundingBox();
 expect(bounds.x).toBeGreaterThanOrEqual(0);
 expect(bounds.x+bounds.width).toBeLessThanOrEqual(320);
 await page.getByRole('button',{name:'Close sharing'}).click();
 await expect(page.locator('#share-dialog')).not.toBeVisible();
});

test('native share receives the final score; cancellation keeps the score available', async ({page}) => {
 await page.addInitScript(() => Object.defineProperty(navigator,'share',{value:async data=>{
  window.sharedScore = data;
  throw new DOMException('Cancelled','AbortError');
 }, configurable:true}));
 await finishGame(page);
 await page.getByRole('button',{name:'Share your score'}).click();
 await page.getByRole('button',{name:'Share score…',exact:true}).click();
 const payload = await page.evaluate(()=>window.sharedScore);
 expect(payload.title).toBe('My Clock Stack score');
 expect(payload.text).toContain('hours');
 expect(payload.url).toBe('http://127.0.0.1:5173/');
 await expect(page.locator('#share-dialog')).toBeVisible();
 await expect(page.locator('#share-status')).toBeEmpty();
});
