import { db } from "@workspace/db";
import {
  artisansTable,
  categoriesTable,
  productImagesTable,
  productsTable,
  profilesTable,
  userRolesTable,
} from "@workspace/db";

const demoSvg = (label: string, background: string, foreground: string) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800"><rect width="800" height="800" fill="${background}"/><circle cx="400" cy="350" r="220" fill="${foreground}" opacity=".85"/><path d="M190 590c95-78 325-78 420 0" fill="none" stroke="${foreground}" stroke-width="34" stroke-linecap="round"/><text x="400" y="720" text-anchor="middle" fill="${foreground}" font-family="Georgia,serif" font-size="34">${label}</text></svg>`)}`;

const demoCategories = [
  { id: "handloom", name: "Handloom", nameHindi: "हथकरघा", icon: "cloth" },
  { id: "textile", name: "Textile", nameHindi: "कपड़ा", icon: "scissors" },
  { id: "pottery", name: "Pottery", nameHindi: "मिट्टी के बर्तन", icon: "pottery" },
  { id: "bamboo", name: "Bamboo", nameHindi: "बांस शिल्प", icon: "basket" },
  { id: "wood", name: "Wood craft", nameHindi: "लकड़ी का काम", icon: "wood" },
  { id: "embroidery", name: "Embroidery", nameHindi: "कढ़ाई", icon: "thread" },
];

const demoProducts = [
  {
    id: "demo-handloom-saree",
    categoryId: "handloom",
    title: "Indigo Handloom Saree",
    titleHindi: "नीली हाथकरघा साड़ी",
    craft: "Handloom weaving",
    region: "Telangana",
    price: "4200",
    quantity: 12,
    imageUrl: demoSvg("HANDLOOM", "#e6ddd1", "#244641"),
  },
  {
    id: "demo-kalamkari-textile",
    categoryId: "textile",
    title: "Kalamkari Garden Panel",
    titleHindi: "कलमकारी गार्डन पैनल",
    craft: "Kalamkari",
    region: "Andhra Pradesh",
    price: "1850",
    quantity: 18,
    imageUrl: demoSvg("KALAMKARI", "#ead3bd", "#9e4838"),
  },
  {
    id: "demo-pottery-set",
    categoryId: "pottery",
    title: "Terracotta Table Set",
    titleHindi: "टेराकोटा टेबल सेट",
    craft: "Terracotta pottery",
    region: "Telangana",
    price: "960",
    quantity: 24,
    imageUrl: demoSvg("POTTERY", "#e0c2a2", "#754a35"),
  },
  {
    id: "demo-bamboo-basket",
    categoryId: "bamboo",
    title: "Bamboo Market Basket",
    titleHindi: "बांस की बाजार टोकरी",
    craft: "Bamboo weaving",
    region: "Assam",
    price: "680",
    quantity: 31,
    imageUrl: demoSvg("BAMBOO", "#d6d6ba", "#52633c"),
  },
  {
    id: "demo-wooden-craft",
    categoryId: "wood",
    title: "Carved Neem Bird",
    titleHindi: "नीम की लकड़ी की चिड़िया",
    craft: "Wood carving",
    region: "Karnataka",
    price: "1200",
    quantity: 8,
    imageUrl: demoSvg("WOOD CRAFT", "#d7bd9d", "#5b4435"),
  },
  {
    id: "demo-embroidered-bag",
    categoryId: "embroidery",
    title: "Kutch Embroidered Tote",
    titleHindi: "कच्छ कढ़ाई वाला बैग",
    craft: "Hand embroidery",
    region: "Gujarat",
    price: "1450",
    quantity: 15,
    imageUrl: demoSvg("EMBROIDERY", "#dcc8d3", "#763d5f"),
  },
];

export async function ensureDemoData(): Promise<void> {
  await db
    .insert(profilesTable)
    .values({
      id: "demo-artisan-profile",
      displayName: "Savitri Devi",
      preferredLanguage: "hi",
    })
    .onConflictDoNothing();

  await db
    .insert(userRolesTable)
    .values({
      id: "demo-artisan-role",
      userId: "demo-artisan-profile",
      role: "artisan",
    })
    .onConflictDoNothing();

  await db
    .insert(artisansTable)
    .values({
      id: "demo-artisan",
      profileId: "demo-artisan-profile",
      craft: "Handloom",
      region: "Telangana",
      experienceYears: 18,
      story:
        "Savitri makes handloom pieces with patient, careful weaving and patterns inspired by the colors around her.",
      storyHindi:
        "सावित्री धैर्य और देखभाल से हाथकरघा बुनाई करती हैं। उनके रंग आसपास की दुनिया से प्रेरित हैं।",
    })
    .onConflictDoNothing();

  await db
    .insert(categoriesTable)
    .values(demoCategories)
    .onConflictDoNothing();

  for (const product of demoProducts) {
    await db
      .insert(productsTable)
      .values({
        id: product.id,
        artisanId: "demo-artisan",
        categoryId: product.categoryId,
        title: product.title,
        titleHindi: product.titleHindi,
        description: "A demo product in the KarigarAI foundation catalog.",
        descriptionHindi: "KarigarAI फाउंडेशन कैटलॉग में एक डेमो उत्पाद।",
        craft: product.craft,
        region: product.region,
        price: product.price,
        quantity: product.quantity,
        status: "published",
      })
      .onConflictDoNothing();

    await db
      .insert(productImagesTable)
      .values({
        id: `${product.id}-original`,
        productId: product.id,
        storagePath: product.imageUrl,
        imageRole: "original",
        mimeType: "image/svg+xml",
      })
      .onConflictDoNothing();
  }
}