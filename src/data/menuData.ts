// Shared menu data in Menu Maestro format
// Dish: name, side dish, extras, total weight (g), allergens, price with VAT

export type MenuItem = {
  id: string;
  name: string;
  side: string;
  extras?: string;
  weight: string; // e.g. "150/200/50 g"
  allergens: number[];
  price: number; // EUR with VAT
  tag?: string;
};

export type DayMenu = {
  day: string;
  shortDay: string;
  soup: { name: string; weight: string; allergens: number[]; price: number };
  items: MenuItem[];
};

export const weeklyMenu: DayMenu[] = [
  {
    day: 'Pondelok', shortDay: 'Po',
    soup: { name: 'Hovädzia vývarová polievka s rezancami', weight: '0,33 l', allergens: [1, 3, 7, 9], price: 1.90 },
    items: [
      { id: 'po-1', name: 'Vyprážaný bravčový rezeň', side: 'Zemiaková kaša', extras: 'Kyslá uhorka', weight: '130/200/30 g', allergens: [1, 3, 7], price: 7.90, tag: 'OBĽÚBENÉ' },
      { id: 'po-2', name: 'Špagety Bolognese', side: 'Strúhaný parmezán', weight: '350/20 g', allergens: [1, 3, 7], price: 7.50 },
      { id: 'po-3', name: 'Grilované kuracie prsia', side: 'Dusená ryža, grilovaná zelenina', weight: '150/150/100 g', allergens: [7], price: 8.20 },
      { id: 'po-4', name: 'Pirohy s bryndzou', side: 'Opečená slanina, kyslá smotana', weight: '250/30/30 g', allergens: [1, 3, 7], price: 7.20 },
    ],
  },
  {
    day: 'Utorok', shortDay: 'Ut',
    soup: { name: 'Kapustová polievka s klobásou', weight: '0,33 l', allergens: [1, 7], price: 1.90 },
    items: [
      { id: 'ut-1', name: 'Bryndzové halušky', side: 'Opečená slanina', extras: 'Kyslé mlieko', weight: '300/50/100 g', allergens: [1, 3, 7], price: 7.90, tag: 'TRADIČNÉ' },
      { id: 'ut-2', name: 'Bravčový guláš', side: 'Hovädzí knedlík', weight: '250/200 g', allergens: [1, 3, 7], price: 7.50 },
      { id: 'ut-3', name: 'Zapekané cestoviny so šunkou', side: 'Eidam, zelenina', weight: '400 g', allergens: [1, 3, 7], price: 6.90 },
      { id: 'ut-4', name: 'Kuracie stehno na paprike', side: 'Halušky', weight: '200/200 g', allergens: [1, 3, 7], price: 7.90 },
    ],
  },
  {
    day: 'Streda', shortDay: 'St',
    soup: { name: 'Šošovicová polievka s údeným mäsom', weight: '0,33 l', allergens: [1, 9], price: 1.90 },
    items: [
      { id: 'st-1', name: 'Pečená kačka', side: 'Lokše, červená kapusta', weight: '200/150/120 g', allergens: [1, 3, 7], price: 9.50, tag: 'ŠPECIÁL' },
      { id: 'st-2', name: 'Morčacie stehno na šampiňónoch', side: 'Dusená ryža', weight: '200/200 g', allergens: [1, 7], price: 8.20 },
      { id: 'st-3', name: 'Vyprážaný syr', side: 'Hranolky', extras: 'Tatárska omáčka', weight: '150/200/50 g', allergens: [1, 3, 7, 10], price: 7.50 },
      { id: 'st-4', name: 'Zemiakové placky s kyslou smotanou', side: 'Údený losos', weight: '200/100/50 g', allergens: [1, 3, 4, 7], price: 8.90 },
    ],
  },
  {
    day: 'Štvrtok', shortDay: 'Št',
    soup: { name: 'Gulášová polievka', weight: '0,33 l', allergens: [1, 7], price: 1.90 },
    items: [
      { id: 'st2-1', name: 'Segedínsky guláš', side: 'Hovädzí knedlík', extras: 'Kyslá smotana', weight: '250/200/30 g', allergens: [1, 3, 7], price: 7.90, tag: 'OBĽÚBENÉ' },
      { id: 'st2-2', name: 'Kuracie curry', side: 'Basmati ryža, naan chlieb', weight: '200/150/80 g', allergens: [1, 7], price: 8.50 },
      { id: 'st2-3', name: 'Grilovaný halloumi šalát', side: 'Mix listový šalát, cherry paradajky', weight: '350 g', allergens: [7], price: 7.90 },
      { id: 'st2-4', name: 'Hovädzia sviečková na smotane', side: 'Hovädzí knedlík, brusnice', weight: '200/200/30 g', allergens: [1, 3, 7, 8, 9], price: 9.90 },
    ],
  },
  {
    day: 'Piatok', shortDay: 'Pi',
    soup: { name: 'Rybacia polievka', weight: '0,33 l', allergens: [1, 4, 7, 9], price: 1.90 },
    items: [
      { id: 'pi-1', name: 'Pečený losos', side: 'Grilovaná zelenina', extras: 'Citrónové maslo', weight: '180/150/30 g', allergens: [4, 7], price: 10.50, tag: 'FRESH' },
      { id: 'pi-2', name: 'Vyprážaná ryba', side: 'Hranolky', extras: 'Remoulade', weight: '150/200/50 g', allergens: [1, 3, 4, 7, 10], price: 8.90 },
      { id: 'pi-3', name: 'Rizoto s lesnými hubami', side: 'Parmezán', weight: '350/20 g', allergens: [7], price: 8.20 },
      { id: 'pi-4', name: 'Treska v pivnom cestíčku', side: 'Zemiakový šalát', weight: '180/200 g', allergens: [1, 3, 4, 7], price: 8.90 },
    ],
  },
];

// Allergen labels per EU regulation
export const allergenLabels: Record<number, string> = {
  1: 'Obilniny obsahujúce lepok',
  2: 'Kôrovce',
  3: 'Vajcia',
  4: 'Ryby',
  5: 'Arašidy',
  6: 'Sójové zrná',
  7: 'Mlieko',
  8: 'Orechy',
  9: 'Zeler',
  10: 'Horčica',
  11: 'Sezamové semená',
  12: 'Oxid siričitý',
  13: 'Vlčí bôb',
  14: 'Mäkkýše',
};
