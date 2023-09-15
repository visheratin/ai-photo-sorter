import localforage from "localforage";
import { Collection } from "./collection";

export class Database {
  constructor() {}

  static setCollections() {
    localforage.config({
      name: "Organizewith.ai",
      version: 1.0,
      driver: localforage.INDEXEDDB,
      storeName: "collections",
    });
  }

  static setCollectionStore(id: string) {
    localforage.config({
      name: "Organizewith.ai",
      version: 1.0,
      driver: localforage.INDEXEDDB,
      storeName: id,
    });
  }

  static async listCollections(): Promise<Collection[]> {
    this.setCollections();
    const collections: Collection[] = [];
    await localforage.iterate((value, _) => {
      collections.push(value as Collection);
    });
    return collections;
  }

  static async createCollection(collection: Collection) {
    this.setCollections();
    await localforage.setItem(collection.id, collection);
  }

  static async updateCollection(collection: Collection) {
    this.setCollections();
    await localforage.setItem(collection.id, collection);
  }

  static async deleteCollection(collection: Collection) {
    this.setCollections();
    await localforage.removeItem(collection.id);
  }
}
