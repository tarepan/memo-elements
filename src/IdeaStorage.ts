import { pipe } from "fp-ts/lib/pipeable";
import { IdeaStorage, Item } from "./idea-inbox";

/**
 * Local Storage Wrapper, which hold entity list in single key
 */
export class EntityListStorage implements IdeaStorage {
  private readonly storage: Storage;
  private readonly id: string;
  /**
   * @param id - storage ID, which is used for data retrieve
   */
  constructor(id: string) {
    this.id = id;
    this.storage = localStorage;
  }
  /**
   * Read localStorage as Map Object
   */
  private readMap(): Map<string, Item> {
    const storage = this.storage;
    return pipe(
      storage.getItem(this.id),
      stg => (stg ? stg : "[]"),
      JSON.parse,
      entries => entries as [string, Item][],
      entries => new Map(entries)
    );
  }
  /**
   * Replace localStorage with input Map
   */
  private writeMap(map: Map<string, Item>): void {
    const storage = this.storage;
    pipe(
      map.entries(),
      Array.from,
      JSON.stringify,
      stg => storage.setItem(this.id, stg)
    );
  }
  /**
   * Read a full entity list
   */
  read(): Item[] {
    return Array.from(this.readMap().values()).reverse();
  }
  /**
   * Create a record
   * @param idea - added idea
   */
  create(idea: Item): void {
    pipe(
      this.readMap(),
      map => map.set(idea.id, idea),
      this.writeMap.bind(this)
    );
  }
  delete(itemID: string): void {
    pipe(
      this.readMap(),
      map => {
        map.delete(itemID);
        return map;
      },
      this.writeMap.bind(this)
    );
  }
}
