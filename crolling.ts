import puppeteer from "puppeteer";
import type { Page } from "puppeteer";


async function crawlProducts() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const url = "https://mpglobal.donki.com/ec-web/d/pcd?titleStr=67CU65SU44O77Zek7Ja07Ja07LyA7Ja0&gpId=g-i_b_skincare&lan=ko-kr";
  await page.goto(url, { waitUntil: "domcontentloaded" });

  // 스크롤 끝까지 내려서 상품 다 로드
  await autoScroll(page);

  // 상품 나올 때까지 기다리기
  await page.waitForSelector("img.goodsImg", { timeout: 20000 });

  const products = await page.$$eval("img.goodsImg", (imgs) =>
    imgs.map((img) => {
      const name = img.getAttribute("alt");
      const imageUrl = img.getAttribute("src");
      const priceBox = img.closest("div.goods-item")?.querySelector("div.referencePrice");
      const priceText = priceBox?.textContent?.trim() || "";

      const rawPrice = priceText.replace(/[^\d]/g, "");
      const price = rawPrice ? parseInt(rawPrice, 10) : null;
      return { name, price, imageUrl };
    })
  );

  console.log("크롤링된 상품 개수:", products.length);
  console.log(products);

  await browser.close();
}

async function autoScroll(page: Page) {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 500;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 500);
    });
  });
}

crawlProducts();
