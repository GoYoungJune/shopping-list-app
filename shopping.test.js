const { test, expect, chromium } = require('@playwright/test');
const path = require('path');

const FILE_URL = 'file://' + path.resolve(__dirname, 'index.html');

test.describe('쇼핑 리스트 앱', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(FILE_URL);
    // localStorage 초기화 (테스트 독립성 보장)
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  // ─── 1. 아이템 추가 ───────────────────────────────────────────────
  test('아이템 추가 - 버튼 클릭', async ({ page }) => {
    await page.fill('#input', '사과');
    await page.click('button:has-text("추가")');

    const items = page.locator('.item .name');
    await expect(items).toHaveCount(1);
    await expect(items.first()).toHaveText('사과');
  });

  test('아이템 추가 - Enter 키', async ({ page }) => {
    await page.fill('#input', '바나나');
    await page.press('#input', 'Enter');

    await expect(page.locator('.item .name').first()).toHaveText('바나나');
    // 입력창 초기화 확인
    await expect(page.locator('#input')).toHaveValue('');
  });

  test('아이템 여러 개 추가', async ({ page }) => {
    for (const item of ['우유', '계란', '빵']) {
      await page.fill('#input', item);
      await page.press('#input', 'Enter');
    }
    await expect(page.locator('.item')).toHaveCount(3);
  });

  test('빈 입력 추가 무시', async ({ page }) => {
    await page.click('button:has-text("추가")');
    await expect(page.locator('.item')).toHaveCount(0);
  });

  // ─── 2. 아이템 체크 ───────────────────────────────────────────────
  test('체크박스 클릭 → 완료 처리', async ({ page }) => {
    await page.fill('#input', '우유');
    await page.press('#input', 'Enter');

    const checkbox = page.locator('.item input[type="checkbox"]').first();
    await checkbox.check();

    await expect(page.locator('.item.done')).toHaveCount(1);
    await expect(page.locator('.item.done .name')).toHaveCSS(
      'text-decoration-line', 'line-through'
    );
  });

  test('체크 → 체크 해제', async ({ page }) => {
    await page.fill('#input', '계란');
    await page.press('#input', 'Enter');

    const checkbox = page.locator('.item input[type="checkbox"]').first();
    await checkbox.check();
    await expect(page.locator('.item.done')).toHaveCount(1);

    await checkbox.uncheck();
    await expect(page.locator('.item.done')).toHaveCount(0);
  });

  test('헤더 메타 정보 업데이트', async ({ page }) => {
    await page.fill('#input', '빵'); await page.press('#input', 'Enter');
    await page.fill('#input', '버터'); await page.press('#input', 'Enter');

    await page.locator('.item input[type="checkbox"]').first().check();

    await expect(page.locator('#meta')).toHaveText('1/2개 완료');
  });

  // ─── 3. 아이템 삭제 ───────────────────────────────────────────────
  test('✕ 버튼으로 개별 삭제', async ({ page }) => {
    await page.fill('#input', '지울 항목');
    await page.press('#input', 'Enter');
    await expect(page.locator('.item')).toHaveCount(1);

    await page.locator('.item .del').first().click();
    await expect(page.locator('.item')).toHaveCount(0);
  });

  test('여러 항목 중 특정 항목 삭제', async ({ page }) => {
    for (const item of ['첫째', '둘째', '셋째']) {
      await page.fill('#input', item);
      await page.press('#input', 'Enter');
    }
    // 가장 최근 추가된 항목(첫 번째)을 삭제
    await page.locator('.item .del').first().click();
    await expect(page.locator('.item')).toHaveCount(2);
  });

  test('완료 항목 일괄 삭제', async ({ page }) => {
    for (const item of ['항목A', '항목B', '항목C']) {
      await page.fill('#input', item);
      await page.press('#input', 'Enter');
    }
    // 앱은 unshift로 추가 → 화면 순서: 항목C(0), 항목B(1), 항목A(2)
    // 중간·마지막(항목B, 항목A)을 체크 → 항목C만 남아야 함
    const boxes = page.locator('.item input[type="checkbox"]');
    await boxes.nth(1).check();
    await boxes.nth(2).check();

    await page.click('#clearBtn');
    await expect(page.locator('.item')).toHaveCount(1);
    await expect(page.locator('.item .name')).toHaveText('항목C');
  });

  // ─── 4. 필터 기능 ─────────────────────────────────────────────────
  test('미완료 필터', async ({ page }) => {
    for (const item of ['A', 'B', 'C']) {
      await page.fill('#input', item);
      await page.press('#input', 'Enter');
    }
    await page.locator('.item input[type="checkbox"]').first().check();

    await page.click('button:has-text("미완료")');
    await expect(page.locator('.item')).toHaveCount(2);
  });

  test('완료 필터', async ({ page }) => {
    for (const item of ['X', 'Y']) {
      await page.fill('#input', item);
      await page.press('#input', 'Enter');
    }
    await page.locator('.item input[type="checkbox"]').first().check();

    await page.click('button:has-text("완료")');
    await expect(page.locator('.item')).toHaveCount(1);
  });

  // ─── 5. localStorage 영속성 ───────────────────────────────────────
  test('새로고침 후에도 데이터 유지', async ({ page }) => {
    await page.fill('#input', '영속 항목');
    await page.press('#input', 'Enter');

    await page.reload();
    await expect(page.locator('.item .name').first()).toHaveText('영속 항목');
  });

  // ─── 6. 엣지 케이스 (프로브) ──────────────────────────────────────
  test('🔍 공백만 있는 입력 무시', async ({ page }) => {
    await page.fill('#input', '   ');
    await page.press('#input', 'Enter');
    await expect(page.locator('.item')).toHaveCount(0);
  });

  test('🔍 특수문자 포함 항목 추가', async ({ page }) => {
    await page.fill('#input', '<script>alert(1)</script>');
    await page.press('#input', 'Enter');
    // XSS 방지: 실제 스크립트가 실행되지 않고 텍스트로 표시되어야 함
    await expect(page.locator('.item')).toHaveCount(1);
    const text = await page.locator('.item .name').first().textContent();
    expect(text).toBe('<script>alert(1)</script>');
  });

  test('🔍 완료 항목 없을 때 일괄 삭제 버튼 비활성화', async ({ page }) => {
    await expect(page.locator('#clearBtn')).toBeDisabled();
  });
});
