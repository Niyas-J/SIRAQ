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
import { ServiceItem } from './types';
import { CSC_SERVICES } from './servicesData';

// Freshly synchronized services seed matching the exact required details & prices
const INITIAL_SERVICES: ServiceItem[] = CSC_SERVICES.map((s, index) => ({
  id: s.id,
  title: s.title,
  category: s.category as any,
  icon: s.icon,
  badge: s.badge,
  description: s.description,
  documents: s.documents,
  turnaroundTime: s.turnaroundTime,
  feeEstimate: s.feeEstimate,
  numericPrice: s.numericPrice ?? (parseInt(s.feeEstimate.replace(/[^0-9]/g, '') || '100', 10)),
  features: s.features,
  isActive: true,
  orderRank: index + 1,
  updatedAt: new Date().toISOString(),
}));

let memoryServices: ServiceItem[] = [...INITIAL_SERVICES];

export const servicesStore = {
  async getAllServices(includeInactive = false): Promise<ServiceItem[]> {
    if (isFirebaseConfigured && db) {
      try {
        const colRef = collection(db, 'services');
        const snapshot = await getDocs(colRef);

        if (snapshot.empty) {
          // Seed updated services into Firestore
          for (const item of INITIAL_SERVICES) {
            await setDoc(doc(db, 'services', item.id), item);
          }
          return includeInactive ? INITIAL_SERVICES : INITIAL_SERVICES.filter((s) => s.isActive);
        }

        const items: ServiceItem[] = [];
        snapshot.forEach((snap) => {
          items.push({ id: snap.id, ...snap.data() } as ServiceItem);
        });

        // Ensure newly updated core services exist in Firestore
        for (const seedItem of INITIAL_SERVICES) {
          const exists = items.some((i) => i.id === seedItem.id);
          if (!exists) {
            await setDoc(doc(db, 'services', seedItem.id), seedItem);
            items.push(seedItem);
          }
        }

        items.sort((a, b) => (a.orderRank || 0) - (b.orderRank || 0));

        if (!includeInactive) {
          return items.filter((s) => s.isActive !== false);
        }
        return items;
      } catch (err) {
        console.error('Firestore getAllServices error:', err);
      }
    }

    if (!includeInactive) {
      return memoryServices.filter((s) => s.isActive);
    }
    return [...memoryServices];
  },

  async getServiceById(id: string): Promise<ServiceItem | null> {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDoc(doc(db, 'services', id));
        if (snap.exists()) {
          return { id: snap.id, ...snap.data() } as ServiceItem;
        }
      } catch (err) {
        console.error('Firestore getServiceById error:', err);
      }
    }
    const found = memoryServices.find((s) => s.id === id);
    return found || null;
  },

  async saveService(service: ServiceItem): Promise<ServiceItem> {
    const now = new Date().toISOString();
    const serviceToSave: ServiceItem = {
      ...service,
      updatedAt: now,
    };

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'services', serviceToSave.id), serviceToSave, { merge: true });
        return serviceToSave;
      } catch (err) {
        console.error('Firestore saveService error:', err);
      }
    }

    const idx = memoryServices.findIndex((s) => s.id === serviceToSave.id);
    if (idx !== -1) {
      memoryServices[idx] = serviceToSave;
    } else {
      memoryServices.push(serviceToSave);
    }
    return serviceToSave;
  },

  async updatePrice(id: string, newFeeEstimate: string, numericPrice?: number): Promise<boolean> {
    const now = new Date().toISOString();
    const cleanNum = numericPrice ?? parseInt(newFeeEstimate.replace(/[^0-9]/g, '') || '0', 10);

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'services', id), {
          feeEstimate: newFeeEstimate,
          numericPrice: cleanNum,
          updatedAt: now,
        });
        return true;
      } catch (err) {
        console.error('Firestore updatePrice error:', err);
      }
    }

    const item = memoryServices.find((s) => s.id === id);
    if (item) {
      item.feeEstimate = newFeeEstimate;
      item.numericPrice = cleanNum;
      item.updatedAt = now;
      return true;
    }
    return false;
  },

  async toggleActive(id: string, currentStatus: boolean): Promise<boolean> {
    const newStatus = !currentStatus;
    const now = new Date().toISOString();

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'services', id), {
          isActive: newStatus,
          updatedAt: now,
        });
        return newStatus;
      } catch (err) {
        console.error('Firestore toggleActive error:', err);
      }
    }

    const item = memoryServices.find((s) => s.id === id);
    if (item) {
      item.isActive = newStatus;
      item.updatedAt = now;
      return newStatus;
    }
    return newStatus;
  },

  async deleteService(id: string): Promise<boolean> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'services', id));
        return true;
      } catch (err) {
        console.error('Firestore deleteService error:', err);
      }
    }

    memoryServices = memoryServices.filter((s) => s.id !== id);
    return true;
  },
};
