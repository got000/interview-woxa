// Seeds the `broker` collection with sample data on first container start
// (only runs against an empty data volume, per mongo image init behavior).

const SYSTEM_USER_ID = ObjectId('6a2af4207864a4377eba5d81');

const BROKER_TYPES = ['cfd', 'bond', 'stock', 'crypto'];
const REGIONS = ['global', 'asia', 'europe', 'americas', 'middle east', 'africa', 'oceania'];

const BROKERS = [
  { name: 'Sterling Capital Markets', desc_th: 'โบรกเกอร์ชั้นนำสำหรับนักลงทุนสถาบัน', desc_en: 'A leading broker for institutional investors.' },
  { name: 'Aurora Global Securities', desc_th: 'บริการซื้อขายหลักทรัพย์ระดับโลก', desc_en: 'Global securities trading services.' },
  { name: 'Pinnacle Asset Partners', desc_th: 'พันธมิตรด้านสินทรัพย์ระดับสูง', desc_en: 'Premium asset management partners.' },
  { name: 'Northbridge Trading Co.', desc_th: 'ผู้นำด้านการซื้อขายข้ามพรมแดน', desc_en: 'A leader in cross-border trading.' },
  { name: 'Veridian Markets', desc_th: 'แพลตฟอร์มซื้อขายที่โปร่งใส', desc_en: 'A transparent trading platform.' },
  { name: 'Crestview Brokerage', desc_th: 'บริการนายหน้าที่เชื่อถือได้', desc_en: 'A trusted brokerage service.' },
  { name: 'Halcyon Financial Group', desc_th: 'กลุ่มการเงินที่มั่นคง', desc_en: 'A stable financial group.' },
  { name: 'Meridian Capital', desc_th: 'ทุนเพื่อการเติบโตที่ยั่งยืน', desc_en: 'Capital for sustainable growth.' },
  { name: 'Solstice Trading Partners', desc_th: 'พันธมิตรซื้อขายที่เชื่อถือได้', desc_en: 'A reliable trading partner.' },
  { name: 'Ironwood Securities', desc_th: 'ความมั่นคงในการลงทุน', desc_en: 'Stability in investment.' },
  { name: 'Cobalt Markets International', desc_th: 'ตลาดการเงินระดับนานาชาติ', desc_en: 'International financial markets.' },
  { name: 'Lighthouse Brokers', desc_th: 'นำทางการลงทุนของคุณ', desc_en: 'Guiding your investments.' },
  { name: 'Granite Peak Capital', desc_th: 'ฐานทุนที่แข็งแกร่ง', desc_en: 'A solid capital foundation.' },
  { name: 'Quantum Edge Trading', desc_th: 'เทคโนโลยีการซื้อขายล้ำสมัย', desc_en: 'Cutting-edge trading technology.' },
  { name: 'Silverline Investments', desc_th: 'การลงทุนที่ชาญฉลาด', desc_en: 'Smart investing.' },
  { name: 'Beacon Hill Markets', desc_th: 'สัญญาณนำทางตลาดของคุณ', desc_en: 'A guiding signal for your markets.' },
  { name: 'Vantage Point Securities', desc_th: 'มุมมองที่ได้เปรียบในการลงทุน', desc_en: 'A vantage point for investing.' },
  { name: 'Equinox Asset Management', desc_th: 'สมดุลของพอร์ตการลงทุน', desc_en: 'Balance for your portfolio.' },
  { name: 'Atlas Frontier Brokers', desc_th: 'เปิดประตูสู่ตลาดใหม่', desc_en: 'Opening doors to new markets.' },
  { name: 'Zenith Trading Group', desc_th: 'จุดสูงสุดของการซื้อขาย', desc_en: 'The peak of trading.' },
];

const now = new Date();

const docs = BROKERS.map((broker, index) => {
  const slug = broker.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return {
    name: { th: broker.name, en: broker.name },
    desc: { th: broker.desc_th, en: broker.desc_en },
    slug,
    broker_type: BROKER_TYPES[index % BROKER_TYPES.length],
    logo_url: `https://picsum.photos/seed/${slug}/800/600`,
    region: REGIONS[index % REGIONS.length],
    content_detail: {
      title: { th: `เกี่ยวกับ ${broker.name}`, en: `About ${broker.name}` },
      paragraph: [
        {
          th: `${broker.name} ให้บริการด้านการลงทุนที่ครอบคลุมสำหรับนักลงทุนทุกระดับ`,
          en: `${broker.name} provides comprehensive investment services for investors of all levels.`,
        },
        {
          th: `เรามุ่งมั่นในความโปร่งใสและการกำกับดูแลตามมาตรฐานสากล`,
          en: `We are committed to transparency and compliance with international standards.`,
        },
      ],
    },
    contact_detail: {
      address: '1 Raffles Place, Singapore',
      email: `contact@${slug}.com`,
      web_site: `https://www.${slug}.com`,
    },
    performance_metrics: {
      aum_growth: Math.floor(Math.random() * 30) + 1,
      liquidity_access: Math.floor(Math.random() * 100) + 1,
      client_retention: Math.floor(Math.random() * 30) + 70,
    },
    status: 'active',
    is_deleted: false,
    created_by: SYSTEM_USER_ID,
    updated_by: SYSTEM_USER_ID,
    created_at: now,
    updated_at: now,
  };
});

db.broker.insertMany(docs);
print(`Seeded ${docs.length} brokers into broker_db.broker`);
