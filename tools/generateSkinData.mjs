import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataDir = path.join(root, "src", "data", "skins");
const imageDir = path.join(root, "public", "skins");

const wears = [
  { quality: "Factory New", short: "fn", factor: 1.38 },
  { quality: "Minimal Wear", short: "mw", factor: 1.08 },
  { quality: "Field-Tested", short: "ft", factor: 0.78 },
  { quality: "Well-Worn", short: "ww", factor: 0.58 },
  { quality: "Battle-Scarred", short: "bs", factor: 0.44 },
];

const rarityColors = {
  "Consumer Grade": "#b5c2cf",
  "Industrial Grade": "#78a9ff",
  "Mil-Spec": "#4b69ff",
  Restricted: "#8847ff",
  Classified: "#d32ce6",
  Covert: "#eb4b4b",
  Contraband: "#e4ae33",
  Extraordinary: "#d9a441",
};

const defaultPriceByRarity = {
  "Consumer Grade": 28,
  "Industrial Grade": 80,
  "Mil-Spec": 210,
  Restricted: 620,
  Classified: 1800,
  Covert: 6200,
  Contraband: 420000,
  Extraordinary: 32000,
};

const premiumPrices = {
  "AWP | Dragon Lore": 2100000,
  "AWP | Gungnir": 540000,
  "AWP | Medusa": 390000,
  "AWP | The Prince": 310000,
  "AWP | Desert Hydra": 160000,
  "AWP | Fade": 82000,
  "AK-47 | Wild Lotus": 360000,
  "AK-47 | Gold Arabesque": 260000,
  "AK-47 | Fire Serpent": 98000,
  "AK-47 | Hydroponic": 88000,
  "M4A4 | Howl": 680000,
  "M4A4 | Poseidon": 115000,
  "M4A1-S | Knight": 82000,
  "M4A1-S | Welcome to the Jungle": 150000,
  "M4A1-S | Blue Phosphor": 52000,
  "AUG | Akihabara Accept": 78000,
  "MP9 | Wild Lily": 43000,
  "Glock-18 | Fade": 98000,
  "Desert Eagle | Blaze": 54000,
  "Desert Eagle | Fennec Fox": 36000,
  "USP-S | Kill Confirmed": 21000,
  "G3SG1 | Chronos": 22000,
  "SCAR-20 | Emerald": 19000,
  "MAG-7 | Cinquedea": 72000,
  "Negev | Mjolnir": 62000,
  "Sport Gloves | Pandora's Box": 420000,
  "Sport Gloves | Vice": 260000,
  "Sport Gloves | Hedge Maze": 240000,
  "Moto Gloves | Spearmint": 210000,
  "Specialist Gloves | Crimson Kimono": 190000,
  "Specialist Gloves | Fade": 120000,
  "Driver Gloves | King Snake": 85000,
  "Hand Wraps | Cobalt Skulls": 72000,
  "Karambit | Doppler": 145000,
  "Karambit | Fade": 165000,
  "Karambit | Gamma Doppler": 175000,
  "Karambit | Lore": 150000,
  "Karambit | Case Hardened": 190000,
  "Karambit | Crimson Web": 155000,
  "Butterfly Knife | Fade": 210000,
  "Butterfly Knife | Doppler": 180000,
  "Butterfly Knife | Gamma Doppler": 205000,
  "Butterfly Knife | Lore": 170000,
  "Butterfly Knife | Crimson Web": 175000,
  "M9 Bayonet | Doppler": 125000,
  "M9 Bayonet | Lore": 118000,
  "Bayonet | Doppler": 72000,
  "Bayonet | Lore": 68000,
};

function add(category, weapon, rarity, collection, names) {
  return names.map((name) => ({ category, weapon, name, rarity, collection }));
}

const baseSkins = [
  ...add("knives", "Karambit", "Extraordinary", "Rare Special Items", [
    "Doppler",
    "Fade",
    "Gamma Doppler",
    "Lore",
    "Case Hardened",
    "Crimson Web",
    "Marble Fade",
    "Tiger Tooth",
    "Slaughter",
    "Autotronic",
    "Damascus Steel",
    "Blue Steel",
  ]),
  ...add("knives", "Butterfly Knife", "Extraordinary", "Rare Special Items", [
    "Doppler",
    "Fade",
    "Gamma Doppler",
    "Lore",
    "Case Hardened",
    "Crimson Web",
    "Marble Fade",
    "Tiger Tooth",
    "Slaughter",
    "Autotronic",
    "Damascus Steel",
    "Night",
  ]),
  ...add("knives", "M9 Bayonet", "Extraordinary", "Rare Special Items", [
    "Doppler",
    "Fade",
    "Gamma Doppler",
    "Lore",
    "Case Hardened",
    "Crimson Web",
    "Marble Fade",
    "Tiger Tooth",
    "Slaughter",
    "Autotronic",
    "Damascus Steel",
    "Ultraviolet",
  ]),
  ...add("knives", "Bayonet", "Extraordinary", "Rare Special Items", [
    "Doppler",
    "Fade",
    "Gamma Doppler",
    "Lore",
    "Case Hardened",
    "Crimson Web",
    "Marble Fade",
    "Tiger Tooth",
    "Slaughter",
    "Autotronic",
    "Damascus Steel",
    "Black Laminate",
  ]),
  ...add("knives", "Talon Knife", "Extraordinary", "Rare Special Items", [
    "Doppler",
    "Fade",
    "Case Hardened",
    "Crimson Web",
    "Marble Fade",
    "Tiger Tooth",
    "Slaughter",
    "Ultraviolet",
  ]),
  ...add("knives", "Skeleton Knife", "Extraordinary", "Rare Special Items", [
    "Fade",
    "Case Hardened",
    "Crimson Web",
    "Slaughter",
    "Blue Steel",
    "Safari Mesh",
  ]),
  ...add("knives", "Sport Gloves", "Extraordinary", "Rare Special Items", [
    "Pandora's Box",
    "Vice",
    "Hedge Maze",
    "Amphibious",
    "Omega",
    "Nocts",
  ]),
  ...add("knives", "Specialist Gloves", "Extraordinary", "Rare Special Items", [
    "Crimson Kimono",
    "Fade",
    "Emerald Web",
    "Mogul",
    "Foundation",
    "Tiger Strike",
  ]),
  ...add("knives", "Moto Gloves", "Extraordinary", "Rare Special Items", [
    "Spearmint",
    "Polygon",
    "POW!",
    "Cool Mint",
    "Turtle",
  ]),
  ...add("knives", "Driver Gloves", "Extraordinary", "Rare Special Items", [
    "King Snake",
    "Imperial Plaid",
    "Crimson Weave",
    "Snow Leopard",
    "Lunar Weave",
  ]),
  ...add("knives", "Hand Wraps", "Extraordinary", "Rare Special Items", [
    "Cobalt Skulls",
    "Slaughter",
    "CAUTION!",
    "Overprint",
    "Arboreal",
  ]),

  ...add("snipers", "AWP", "Covert", "Iconic AWP", [
    "Dragon Lore",
    "Gungnir",
    "Medusa",
    "The Prince",
    "Desert Hydra",
    "Fade",
    "Asiimov",
    "Lightning Strike",
    "Oni Taiji",
    "Wildfire",
    "Hyper Beast",
    "Graphite",
    "Redline",
    "Neo-Noir",
    "Containment Breach",
    "Man-o'-war",
    "Boom",
    "Fever Dream",
    "Atheris",
    "Mortis",
    "Elite Build",
    "Capillary",
    "Safari Mesh",
  ]),
  ...add("snipers", "SSG 08", "Classified", "Scout", [
    "Dragonfire",
    "Blood in the Water",
    "Death's Head",
    "Big Iron",
    "Turbo Peek",
    "Abyss",
    "Fever Dream",
    "Ghost Crusader",
    "Parallax",
    "Mainframe 001",
    "Acid Fade",
    "Detour",
  ]),
  ...add("snipers", "G3SG1", "Restricted", "Autosnipers", [
    "The Executioner",
    "Flux",
    "Chronos",
    "High Seas",
    "Stinger",
    "Orange Kimono",
    "Hunter",
  ]),
  ...add("snipers", "SCAR-20", "Restricted", "Autosnipers", [
    "Bloodsport",
    "Cyrex",
    "Emerald",
    "Cardiac",
    "Blueprint",
    "Magna Carta",
    "Powercore",
  ]),

  ...add("rifles", "AK-47", "Covert", "AK-47", [
    "Case Hardened",
    "Fire Serpent",
    "Gold Arabesque",
    "Wild Lotus",
    "Hydroponic",
    "X-Ray",
    "Vulcan",
    "Fuel Injector",
    "Bloodsport",
    "Asiimov",
    "Neon Rider",
    "The Empress",
    "Nightwish",
    "Redline",
    "Wasteland Rebel",
    "Neon Revolution",
    "Legion of Anubis",
    "Phantom Disruptor",
    "Slate",
    "Ice Coaled",
    "Point Disarray",
    "Frontside Misty",
    "Aquamarine Revenge",
    "Leet Museo",
    "Head Shot",
    "Inheritance",
  ]),
  ...add("rifles", "M4A4", "Covert", "M4A4", [
    "Howl",
    "Poseidon",
    "The Emperor",
    "Asiimov",
    "Neo-Noir",
    "Desolate Space",
    "Bullet Rain",
    "Evil Daimyo",
    "Hellfire",
    "In Living Color",
    "Buzz Kill",
    "The Coalition",
    "Cyber-Security",
    "Temukau",
    "Dragon King",
    "Royal Paladin",
    "Magnesium",
  ]),
  ...add("rifles", "M4A1-S", "Covert", "M4A1-S", [
    "Knight",
    "Welcome to the Jungle",
    "Hot Rod",
    "Printstream",
    "Blue Phosphor",
    "Icarus Fell",
    "Masterpiece",
    "Golden Coil",
    "Chantico's Fire",
    "Player Two",
    "Hyper Beast",
    "Decimator",
    "Mecha Industries",
    "Nightmare",
    "Cyrex",
    "Atomic Alloy",
    "Emphorosaur-S",
    "Black Lotus",
  ]),
  ...add("rifles", "AUG", "Classified", "AUG", [
    "Akihabara Accept",
    "Midnight Lily",
    "Flame Jormungandr",
    "Chameleon",
    "Momentum",
    "Syd Mead",
    "Bengal Tiger",
    "Death by Puppy",
    "Aristocrat",
    "Fleet Flock",
    "Stymphalian",
  ]),
  ...add("rifles", "SG 553", "Classified", "SG 553", [
    "Integrale",
    "Bulldozer",
    "Hazard Pay",
    "Colony IV",
    "Cyrex",
    "Pulse",
    "Tiger Moth",
    "Dragon Tech",
    "Darkwing",
    "Phantom",
    "Candy Apple",
  ]),
  ...add("rifles", "FAMAS", "Classified", "FAMAS", [
    "Commemoration",
    "Meltdown",
    "Roll Cage",
    "Eye of Athena",
    "Mecha Industries",
    "Rapid Eye Movement",
    "Valence",
    "Djinn",
    "Sergeant",
    "ZX Spectron",
    "Styx",
  ]),
  ...add("rifles", "Galil AR", "Restricted", "Galil AR", [
    "Phoenix",
    "Chatterbox",
    "Sugar Rush",
    "Cerberus",
    "Eco",
    "Chromatic Aberration",
    "Stone Cold",
    "Signal",
    "Rocket Pop",
    "Crimson Tsunami",
    "Tuxedo",
  ]),

  ...add("pistols", "Desert Eagle", "Covert", "Pistols", [
    "Blaze",
    "Fennec Fox",
    "Emerald Jormungandr",
    "Printstream",
    "Ocean Drive",
    "Code Red",
    "Kumicho Dragon",
    "Mecha Industries",
    "Cobalt Disruption",
    "Hypnotic",
    "Golden Koi",
    "Conspiracy",
    "Sunset Storm",
    "Trigger Discipline",
  ]),
  ...add("pistols", "USP-S", "Classified", "Pistols", [
    "Kill Confirmed",
    "Printstream",
    "The Traitor",
    "Orion",
    "Neo-Noir",
    "Monster Mashup",
    "Cortex",
    "Stainless",
    "Blueprint",
    "Cyrex",
    "Ticket to Hell",
    "Guardian",
    "Dark Water",
  ]),
  ...add("pistols", "Glock-18", "Classified", "Pistols", [
    "Fade",
    "Dragon Tattoo",
    "Gamma Doppler",
    "Neo-Noir",
    "Bullet Queen",
    "Vogue",
    "Water Elemental",
    "Wasteland Rebel",
    "Snack Attack",
    "Moonrise",
    "Grinder",
    "Candy Apple",
    "Nuclear Garden",
  ]),
  ...add("pistols", "P250", "Restricted", "Pistols", [
    "Whiteout",
    "See Ya Later",
    "Muertos",
    "Undertow",
    "Asiimov",
    "Cartel",
    "Wingshot",
    "Mehndi",
    "Nuclear Threat",
    "Franklin",
    "Valence",
    "Supernova",
    "Sand Dune",
  ]),
  ...add("pistols", "Five-SeveN", "Classified", "Pistols", [
    "Case Hardened",
    "Hyper Beast",
    "Angry Mob",
    "Monkey Business",
    "Fairy Tale",
    "Copper Galaxy",
    "Candy Apple",
    "Boost Protocol",
    "Fowl Play",
    "Triumvirate",
  ]),
  ...add("pistols", "Tec-9", "Restricted", "Pistols", [
    "Decimator",
    "Fuel Injector",
    "Nuclear Threat",
    "Terrace",
    "Isaac",
    "Remote Control",
    "Avalanche",
    "Re-Entry",
    "Snek-9",
    "Bamboozle",
  ]),
  ...add("pistols", "CZ75-Auto", "Restricted", "Pistols", [
    "Victoria",
    "Xiangliu",
    "Yellow Jacket",
    "The Fuschia Is Now",
    "Tacticat",
    "Tigris",
    "Eco",
    "Pole Position",
  ]),
  ...add("pistols", "Dual Berettas", "Restricted", "Pistols", [
    "Cobra Strike",
    "Duelist",
    "Twin Turbo",
    "Melondrama",
    "Marina",
    "Dezastre",
    "Hemoglobin",
    "Balance",
  ]),
  ...add("pistols", "R8 Revolver", "Restricted", "Pistols", [
    "Fade",
    "Llama Cannon",
    "Skull Crusher",
    "Crimson Web",
    "Reboot",
    "Crazy 8",
  ]),
  ...add("pistols", "P2000", "Restricted", "Pistols", [
    "Fire Elemental",
    "Ocean Foam",
    "Imperial Dragon",
    "Corticera",
    "Wicked Sick",
    "Amber Fade",
    "Obsidian",
  ]),

  ...add("smgs", "MP9", "Classified", "SMGs", [
    "Wild Lily",
    "Hot Rod",
    "Starlight Protector",
    "Food Chain",
    "Mount Fuji",
    "Hydra",
    "Rose Iron",
    "Hypnotic",
    "Bulldozer",
    "Airlock",
    "Ruby Poison Dart",
  ]),
  ...add("smgs", "MAC-10", "Classified", "SMGs", [
    "Stalker",
    "Neon Rider",
    "Disco Tech",
    "Propaganda",
    "Gold Brick",
    "Case Hardened",
    "Fade",
    "Heat",
    "Curse",
    "Tatter",
    "Sakkaku",
  ]),
  ...add("smgs", "MP7", "Restricted", "SMGs", [
    "Bloodsport",
    "Nemesis",
    "Fade",
    "Whiteout",
    "Abyssal Apparition",
    "Neon Ply",
    "Impire",
    "Ocean Foam",
    "Skulls",
    "Powercore",
  ]),
  ...add("smgs", "MP5-SD", "Restricted", "SMGs", [
    "Phosphor",
    "Oxide Oasis",
    "Agent",
    "Desert Strike",
    "Kitbash",
    "Autumn Twilly",
    "Gauss",
  ]),
  ...add("smgs", "UMP-45", "Restricted", "SMGs", [
    "Fade",
    "Minotaur's Labyrinth",
    "Crime Scene",
    "Momentum",
    "Primal Saber",
    "Wild Child",
    "Plastique",
    "Moonrise",
    "Scaffold",
    "Grand Prix",
  ]),
  ...add("smgs", "P90", "Classified", "SMGs", [
    "Emerald Dragon",
    "Death by Kitty",
    "Asiimov",
    "Cold Blooded",
    "Shapewood",
    "Trigon",
    "Nostalgia",
    "Run and Hide",
    "Tiger Pit",
    "Desert Warfare",
  ]),
  ...add("smgs", "PP-Bizon", "Restricted", "SMGs", [
    "Judgement of Anubis",
    "High Roller",
    "Antique",
    "Embargo",
    "Osiris",
    "Fuel Rod",
    "Blue Streak",
  ]),

  ...add("heavy", "XM1014", "Restricted", "Heavy", [
    "Entombed",
    "Tranquility",
    "Seasons",
    "Incinegator",
    "Elegant Vines",
    "Watchdog",
    "Red Python",
  ]),
  ...add("heavy", "MAG-7", "Restricted", "Heavy", [
    "Cinquedea",
    "Justice",
    "Counter Terrace",
    "Bulldozer",
    "Heat",
    "BI83 Spectrum",
    "Monster Call",
    "SWAG-7",
  ]),
  ...add("heavy", "Nova", "Restricted", "Heavy", [
    "Bloomstick",
    "Hyper Beast",
    "Antique",
    "Baroque Orange",
    "Toy Soldier",
    "Graphite",
    "Wild Six",
    "Koi",
  ]),
  ...add("heavy", "Sawed-Off", "Restricted", "Heavy", [
    "The Kraken",
    "Wasteland Princess",
    "Devourer",
    "Kiss Love",
    "Copper",
    "Orange DDPAT",
    "Limelight",
    "Apocalypto",
  ]),
  ...add("heavy", "M249", "Mil-Spec", "Heavy", [
    "Impact Drill",
    "Nebula Crusader",
    "Aztec",
    "Shipping Forecast",
    "Emerald Poison Dart",
    "System Lock",
  ]),
  ...add("heavy", "Negev", "Mil-Spec", "Heavy", [
    "Mjolnir",
    "Loudmouth",
    "Power Loader",
    "Phoenix",
    "dev_texture",
    "Prototype",
    "Ultralight",
    "Lionfish",
  ]),
];

function slug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function xml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function splitTitle(value) {
  const parts = value.split(" ");
  const rows = [""];
  for (const part of parts) {
    const next = `${rows[rows.length - 1]} ${part}`.trim();
    if (next.length > 18 && rows.length < 3) rows.push(part);
    else rows[rows.length - 1] = next;
  }
  return rows;
}

function estimatePrice(skin) {
  const key = `${skin.weapon} | ${skin.name}`;
  if (premiumPrices[key]) return premiumPrices[key];

  let price = defaultPriceByRarity[skin.rarity] ?? 250;
  const joined = key.toLowerCase();

  if (skin.category === "knives") price *= 2.15;
  if (joined.includes("doppler") || joined.includes("fade") || joined.includes("lore")) price *= 1.8;
  if (joined.includes("case hardened")) price *= 1.65;
  if (joined.includes("crimson web")) price *= 1.45;
  if (joined.includes("printstream") || joined.includes("asiimov") || joined.includes("neo-noir")) price *= 1.55;
  if (joined.includes("bloodsport") || joined.includes("hyper beast")) price *= 1.35;
  if (joined.includes("redline") || joined.includes("cyrex")) price *= 1.2;
  if (joined.includes("safari mesh") || joined.includes("sand dune")) price *= 0.35;

  return Math.max(20, Math.round(price));
}

function renderSkinSvg(item) {
  const color = rarityColors[item.rarity] ?? "#e4ae33";
  const titleRows = splitTitle(item.skinName);
  const titleY = titleRows.length === 1 ? 170 : titleRows.length === 2 ? 154 : 139;
  const subtitle = `${item.weapon} / ${item.quality}`;
  const titleText = titleRows
    .map(
      (row, index) =>
        `<text x="28" y="${titleY + index * 25}" fill="#f9fbff" font-size="23" font-weight="800">${xml(row)}</text>`,
    )
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="260" viewBox="0 0 420 260" role="img" aria-label="${xml(item.name)}">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#121722"/>
      <stop offset="0.55" stop-color="#1f2735"/>
      <stop offset="1" stop-color="${color}"/>
    </linearGradient>
    <linearGradient id="metal" x1="0" x2="1">
      <stop offset="0" stop-color="#e8edf5"/>
      <stop offset="0.45" stop-color="#8e98a8"/>
      <stop offset="1" stop-color="#f7f0cf"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="12" flood-color="#000" flood-opacity="0.35"/>
    </filter>
  </defs>
  <rect width="420" height="260" rx="16" fill="url(#bg)"/>
  <path d="M22 42 C90 12 130 18 190 42 C250 66 312 50 392 22 L392 86 C326 116 256 112 198 86 C132 56 82 74 22 112 Z" fill="${color}" opacity="0.22"/>
  <g transform="translate(50 72) rotate(-8)" filter="url(#shadow)">
    <rect x="38" y="52" width="230" height="28" rx="10" fill="url(#metal)"/>
    <rect x="242" y="43" width="74" height="18" rx="8" fill="#dde4ef"/>
    <rect x="72" y="80" width="92" height="22" rx="8" fill="#384150"/>
    <rect x="112" y="96" width="44" height="44" rx="10" fill="#242b37"/>
    <rect x="168" y="84" width="52" height="15" rx="7" fill="#f2c24f"/>
    <circle cx="46" cy="66" r="16" fill="#242b37"/>
  </g>
  <rect x="24" y="24" width="118" height="28" rx="7" fill="#0e131d" opacity="0.76"/>
  <text x="34" y="43" fill="${color}" font-size="14" font-weight="800">${xml(item.rarity)}</text>
  ${titleText}
  <text x="28" y="226" fill="#d7deea" font-size="15" font-weight="700">${xml(subtitle)}</text>
  <text x="314" y="226" fill="#ffffff" font-size="17" font-weight="900">${item.value.toLocaleString("uk-UA")} MC</text>
</svg>`;
}

rmSync(dataDir, { recursive: true, force: true });
rmSync(imageDir, { recursive: true, force: true });
mkdirSync(dataDir, { recursive: true });
mkdirSync(imageDir, { recursive: true });

const grouped = new Map();
let total = 0;

for (const skin of baseSkins) {
  const basePrice = estimatePrice(skin);

  for (const wear of wears) {
    const id = `${slug(skin.weapon)}-${slug(skin.name)}-${wear.short}`;
    const value = Math.max(10, Math.round(basePrice * wear.factor));
    const item = {
      id,
      name: `${skin.weapon} | ${skin.name}`,
      skinName: skin.name,
      weapon: skin.weapon,
      quality: wear.quality,
      rarity: skin.name === "Howl" && skin.weapon === "M4A4" ? "Contraband" : skin.rarity,
      category: skin.category,
      collection: skin.collection,
      image: `/skins/${id}.svg`,
      value,
    };

    const categoryItems = grouped.get(skin.category) ?? [];
    categoryItems.push(item);
    grouped.set(skin.category, categoryItems);
    writeFileSync(path.join(imageDir, `${id}.svg`), renderSkinSvg(item), "utf8");
    total += 1;
  }
}

for (const [category, items] of grouped) {
  items.sort((a, b) => b.value - a.value || a.name.localeCompare(b.name));
  writeFileSync(path.join(dataDir, `${category}.json`), `${JSON.stringify(items, null, 2)}\n`, "utf8");
}

writeFileSync(
  path.join(dataDir, "catalog-meta.json"),
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      baseSkinCount: baseSkins.length,
      itemCount: total,
      note: "Fan-made local-only collection. Values are in-game coin values styled after UAH market ranges.",
    },
    null,
    2,
  )}\n`,
  "utf8",
);

console.log(`Generated ${total} skin variants from ${baseSkins.length} base skins.`);
