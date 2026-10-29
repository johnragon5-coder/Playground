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
