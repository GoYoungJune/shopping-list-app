const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "AI 기술 트렌드 2025–2026";

const slide = pres.addSlide();
slide.background = { color: "0A0F1E" };

// ─── PALETTE ───
const P = {
  bg:      "0A0F1E",
  header:  "0D1526",
  card:    "131D30",
  border:  "1E2E45",
  white:   "FFFFFF",
  gray:    "8899AA",
  dimgray: "3A4D62",
  blue:    "3B82F6",
  cyan:    "06B6D4",
  purple:  "8B5CF6",
  emerald: "10B981",
  amber:   "F59E0B",
  rose:    "F43F5E",
};

// ─── HEADER BAND ───
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 1.05,
  fill: { color: P.header }, line: { color: P.header },
});

// 파란 강조 선
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 0.07, h: 1.05,
  fill: { color: P.blue }, line: { color: P.blue },
});

// 메인 타이틀
slide.addText("AI 기술 트렌드  2025 — 2026", {
  x: 0.22, y: 0.1, w: 7.2, h: 0.52,
  fontSize: 26, fontFace: "Calibri", bold: true,
  color: P.white, align: "left", valign: "middle", margin: 0,
});

// 서브타이틀
slide.addText("글로벌 주요 동향 6선 · Gartner · McKinsey · OpenAI · Anthropic", {
  x: 0.22, y: 0.62, w: 7.5, h: 0.3,
  fontSize: 9.5, fontFace: "Calibri",
  color: P.gray, align: "left", valign: "middle", margin: 0,
});

// 배지
slide.addShape(pres.shapes.RECTANGLE, {
  x: 8.62, y: 0.23, w: 1.05, h: 0.52,
  fill: { color: P.blue }, line: { color: P.blue },
});
slide.addText("2025–2026", {
  x: 8.62, y: 0.23, w: 1.05, h: 0.52,
  fontSize: 8.5, fontFace: "Calibri", bold: true,
  color: P.white, align: "center", valign: "middle",
});

// ─── CARD GRID ───
const trends = [
  {
    num: "01", color: P.blue,
    title: "멀티모달 AI",
    desc: "텍스트·이미지·음성·영상을 단일 모델이 동시에 처리. GPT-4o·Gemini Ultra 등 통합 AI가 기본값으로 정착.",
  },
  {
    num: "02", color: P.cyan,
    title: "자율 AI 에이전트",
    desc: "스스로 계획·도구 호출·실행하는 에이전트가 업무 자동화 핵심으로 부상. MCP·LangGraph 생태계 폭발적 성장.",
  },
  {
    num: "03", color: P.purple,
    title: "소형 언어 모델 (SLM)",
    desc: "Phi-3·Gemma·Llama 3.2 등 온디바이스 모델이 모바일·엣지에서 구동, 프라이버시·오프라인 처리 실현.",
  },
  {
    num: "04", color: P.emerald,
    title: "AI 코드 생성",
    desc: "Vibe Coding 패러다임으로 개발자 생산성 극적 향상. 비개발자도 자연어로 앱 제작하는 시대 본격화.",
  },
  {
    num: "05", color: P.amber,
    title: "멀티에이전트 협력",
    desc: "전문화된 AI 여럿이 역할을 나눠 협력하는 오케스트레이션 상용화. 복잡한 워크플로우 완전 자동화 가능.",
  },
  {
    num: "06", color: P.rose,
    title: "AI 거버넌스·규제",
    desc: "EU AI Act 발효, 미국·한국 AI 안전법 제정 추진. 책임·투명성·설명가능성(XAI) 요구 기업 핵심 과제로.",
  },
];

const cW = 3.03;
const cH = 1.91;
const gX = 0.155;
const gY = 0.14;
const sX = 0.3;
const sY = 1.14;

trends.forEach((t, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const x = sX + col * (cW + gX);
  const y = sY + row * (cH + gY);

  // 카드 배경
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w: cW, h: cH,
    fill: { color: P.card },
    line: { color: P.border, width: 0.75 },
  });

  // 상단 컬러 바
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w: cW, h: 0.055,
    fill: { color: t.color }, line: { color: t.color },
  });

  // 번호
  slide.addText(t.num, {
    x: x + 0.14, y: y + 0.1, w: 0.52, h: 0.44,
    fontSize: 21, fontFace: "Calibri", bold: true,
    color: t.color, align: "left", valign: "middle", margin: 0,
  });

  // 트렌드 제목
  slide.addText(t.title, {
    x: x + 0.7, y: y + 0.1, w: cW - 0.84, h: 0.44,
    fontSize: 12.5, fontFace: "Calibri", bold: true,
    color: P.white, align: "left", valign: "middle", margin: 0,
  });

  // 구분선
  slide.addShape(pres.shapes.LINE, {
    x: x + 0.14, y: y + 0.61, w: cW - 0.28, h: 0,
    line: { color: P.dimgray, width: 0.75 },
  });

  // 설명
  slide.addText(t.desc, {
    x: x + 0.14, y: y + 0.69, w: cW - 0.28, h: cH - 0.83,
    fontSize: 9.5, fontFace: "Calibri",
    color: P.gray, align: "left", valign: "top", margin: 0,
  });
});

// ─── FOOTER ───
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 5.37, w: 10, h: 0.255,
  fill: { color: P.header }, line: { color: P.header },
});
slide.addText("© 2025  Compiled from: Gartner Hype Cycle · McKinsey Global Institute · OpenAI · Anthropic · MIT Technology Review", {
  x: 0.22, y: 5.37, w: 8.8, h: 0.255,
  fontSize: 7.5, fontFace: "Calibri",
  color: P.dimgray, align: "left", valign: "middle", margin: 0,
});

pres.writeFile({ fileName: "AI-트렌드-2025-2026.pptx" })
  .then(() => console.log("✅ AI-트렌드-2025-2026.pptx 생성 완료"))
  .catch(e => { console.error("❌ 오류:", e); process.exit(1); });
