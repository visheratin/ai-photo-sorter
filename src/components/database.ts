import localforage from "localforage";
import { Collection } from "@/lib/schemas";

export class Database {
  constructor() {}

  setCollections() {
    localforage.config({
      name: "Organizewith.ai",
      version: 1.0,
      driver: localforage.INDEXEDDB,
      storeName: "collections",
    });
  }

  setCollectionStore(id: string) {
    localforage.config({
      name: "Organizewith.ai",
      version: 1.0,
      driver: localforage.INDEXEDDB,
      storeName: id,
    });
  }

  async listCollections(): Promise<Collection[]> {
    this.setCollections();
    const collections: Collection[] = [];
    await localforage.iterate((value, _) => {
      collections.push(value as Collection);
    });
    return collections;
  }

  async createCollection(collection: Collection) {
    this.setCollections();
    await localforage.setItem(collection.id, collection);
  }
}
