import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { ProductItem } from './types';
import { FRAMES_COLLECTION, HAMPERS_COLLECTION } from './servicesData';

// Convert existing static collections into initial ProductItem seed
const INITIAL_PRODUCTS: ProductItem[] = [
  ...FRAMES_COLLECTION.map((f, i) => ({
    id: f.id,
    name: f.name,
    category: 'Customized Photo Frames' as const,
    tagline: f.tagline,
    description: `Materials: ${f.materials}. Perfect for living rooms, bedrooms, and memorable gifts.`,
    price: f.priceStart,
    discountPrice: Math.round(f.priceStart * 1.25),
    badge: f.badge,
    image: f.image,
    materials: f.materials,
    popularSizes: f.popularSizes,
    features: f.features,
    isAvailable: true,
    isFeatured: i < 2,
    orderRank: i + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })),
  ...HAMPERS_COLLECTION.map((h, i) => ({
    id: h.id,
    name: h.name,
    category: 'Gift Hampers' as const,
    tagline: h.occasion,
    description: `Includes: ${h.includedItems.join(', ')}. Beautifully packaged in ${h.packaging}.`,
    price: h.priceStart,
    discountPrice: Math.round(h.priceStart * 1.2),
    badge: h.badge,
    image: h.image,
    includedItems: h.includedItems,
    features: h.features,
    isAvailable: true,
    isFeatured: true,
    orderRank: FRAMES_COLLECTION.length + i + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })),
  // Additional seed for Anniversary / Birthday / Wedding / Personalized
  {
    id: 'anniversary-wood-cutout',
    name: 'Personalized Couple Anniversary Plaque',
    category: 'Anniversary Gifts',
    tagline: 'Laser engraved names with date & golden metallic floral accents',
    description: 'Custom handcrafted birchwood keepsake designed to celebrate milestones and cherished wedding memories.',
    price: 899,
    discountPrice: 1199,
    badge: 'Popular',
    image: '/images/frames-showcase.jpg',
    materials: 'Natural Solid Birch & Gold Foil Engraving',
    features: ['Custom Names & Date Engraving', 'Natural Matte Protective Seal', 'Desktop Stand Included'],
    isAvailable: true,
    isFeatured: true,
    orderRank: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'birthday-neon-box',
    name: 'Celebration Birthday Hamper Deluxe',
    category: 'Birthday Gifts',
    tagline: 'Complete party in a box with customized LED light & sweets',
    description: 'Bespoke birthday gift set with custom greeting card, photo polaroids, imported chocolates, and a luminous personalized keepsake.',
    price: 1299,
    discountPrice: 1599,
    badge: 'Trending',
    image: '/images/hampers-showcase.jpg',
    includedItems: ['Custom LED Name Frame', 'Artisanal Chocolates Box', 'Mini Photo Memories Strip', 'Scented Candle'],
    features: ['Custom Photo Integration', 'Luxury Satin Packaging', 'Express Handover Available'],
    isAvailable: true,
    isFeatured: true,
    orderRank: 11,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let memoryProducts: ProductItem[] = [...INITIAL_PRODUCTS];

export const productsStore = {
  async getAllProducts(includeUnavailable = false): Promise<ProductItem[]> {
    if (isFirebaseConfigured && db) {
      try {
        const colRef = collection(db, 'products');
        const snapshot = await getDocs(colRef);

        if (snapshot.empty) {
          // Seed to Firestore
          for (const item of INITIAL_PRODUCTS) {
            await setDoc(doc(db, 'products', item.id), item);
          }
          return includeUnavailable ? INITIAL_PRODUCTS : INITIAL_PRODUCTS.filter((p) => p.isAvailable);
        }

        const items: ProductItem[] = [];
        snapshot.forEach((snap) => {
          items.push({ id: snap.id, ...snap.data() } as ProductItem);
        });

        items.sort((a, b) => (a.orderRank || 0) - (b.orderRank || 0));

        if (!includeUnavailable) {
          return items.filter((p) => p.isAvailable !== false);
        }
        return items;
      } catch (err) {
        console.error('Firestore getAllProducts error:', err);
      }
    }

    if (!includeUnavailable) {
      return memoryProducts.filter((p) => p.isAvailable);
    }
    return [...memoryProducts];
  },

  async getProductById(id: string): Promise<ProductItem | null> {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDoc(doc(db, 'products', id));
        if (snap.exists()) {
          return { id: snap.id, ...snap.data() } as ProductItem;
        }
      } catch (err) {
        console.error('Firestore getProductById error:', err);
      }
    }
    const found = memoryProducts.find((p) => p.id === id);
    return found || null;
  },

  async saveProduct(product: ProductItem): Promise<ProductItem> {
    const now = new Date().toISOString();
    const itemToSave: ProductItem = {
      ...product,
      updatedAt: now,
      createdAt: product.createdAt || now,
    };

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'products', itemToSave.id), itemToSave, { merge: true });
        return itemToSave;
      } catch (err) {
        console.error('Firestore saveProduct error:', err);
      }
    }

    const idx = memoryProducts.findIndex((p) => p.id === itemToSave.id);
    if (idx !== -1) {
      memoryProducts[idx] = itemToSave;
    } else {
      memoryProducts.push(itemToSave);
    }
    return itemToSave;
  },

  async updateProductPrice(id: string, price: number, discountPrice?: number): Promise<boolean> {
    const now = new Date().toISOString();
    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'products', id), {
          price,
          discountPrice: discountPrice || null,
          updatedAt: now,
        });
        return true;
      } catch (err) {
        console.error('Firestore updateProductPrice error:', err);
      }
    }

    const item = memoryProducts.find((p) => p.id === id);
    if (item) {
      item.price = price;
      if (discountPrice !== undefined) item.discountPrice = discountPrice;
      item.updatedAt = now;
      return true;
    }
    return false;
  },

  async toggleAvailability(id: string, currentStatus: boolean): Promise<boolean> {
    const newStatus = !currentStatus;
    const now = new Date().toISOString();

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'products', id), {
          isAvailable: newStatus,
          updatedAt: now,
        });
        return newStatus;
      } catch (err) {
        console.error('Firestore toggleAvailability error:', err);
      }
    }

    const item = memoryProducts.find((p) => p.id === id);
    if (item) {
      item.isAvailable = newStatus;
      item.updatedAt = now;
      return newStatus;
    }
    return newStatus;
  },

  async toggleFeatured(id: string, currentStatus: boolean): Promise<boolean> {
    const newStatus = !currentStatus;
    const now = new Date().toISOString();

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'products', id), {
          isFeatured: newStatus,
          updatedAt: now,
        });
        return newStatus;
      } catch (err) {
        console.error('Firestore toggleFeatured error:', err);
      }
    }

    const item = memoryProducts.find((p) => p.id === id);
    if (item) {
      item.isFeatured = newStatus;
      item.updatedAt = now;
      return newStatus;
    }
    return newStatus;
  },

  async deleteProduct(id: string): Promise<boolean> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'products', id));
        return true;
      } catch (err) {
        console.error('Firestore deleteProduct error:', err);
      }
    }

    memoryProducts = memoryProducts.filter((p) => p.id !== id);
    return true;
  },
};

