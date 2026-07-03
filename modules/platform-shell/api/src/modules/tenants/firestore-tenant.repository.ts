import { firestore } from "@shared/firebase/admin.js";
import type {
  CreateTenantInput,
  Tenant,
  UpdateTenantInput,
} from "@shared/types/tenant.js";
import type { TenantRepository } from "./tenant.repository.js";

function toDate(value: unknown): Date {
  if (value && typeof value === "object" && "toDate" in value) {
    return (value as { toDate(): Date }).toDate();
  }

  return value instanceof Date ? value : new Date(String(value));
}

export class FirestoreTenantRepository implements TenantRepository {
  private readonly collection = firestore.collection("tenants");

  private map(id: string, data: FirebaseFirestore.DocumentData): Tenant {
    return {
      id,
      slug: data.slug,
      legalName: data.legalName,
      branding: data.branding,
      activeModules: data.activeModules ?? [],
      status: data.status,
      createdAt: toDate(data.createdAt),
      updatedAt: toDate(data.updatedAt),
    };
  }

  async list(): Promise<Tenant[]> {
    const snapshot = await this.collection.orderBy("legalName", "asc").get();
    return snapshot.docs.map((doc) => this.map(doc.id, doc.data()));
  }

  async getById(id: string): Promise<Tenant | null> {
    const document = await this.collection.doc(id).get();
    return document.exists ? this.map(document.id, document.data()!) : null;
  }

  async findBySlug(slug: string): Promise<Tenant | null> {
    const snapshot = await this.collection
      .where("slug", "==", slug)
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    const document = snapshot.docs[0];
    return this.map(document.id, document.data());
  }

  async create(data: CreateTenantInput): Promise<Tenant> {
    const now = new Date();
    const reference = this.collection.doc();
    const tenant: Tenant = { id: reference.id, ...data, createdAt: now, updatedAt: now };
    const { id: _id, ...document } = tenant;
    await reference.set(document);
    return tenant;
  }

  async update(id: string, data: UpdateTenantInput): Promise<Tenant> {
    await this.collection.doc(id).update({ ...data, updatedAt: new Date() });
    return (await this.getById(id))!;
  }
}
