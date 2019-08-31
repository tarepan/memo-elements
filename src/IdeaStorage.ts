import { pipe } from "fp-ts/lib/pipeable";
import { IdeaStorage } from "./idea-inbox";

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
  read(): string[] {
    const listStg = this.storage.getItem(this.id);
    return listStg !== null ? JSON.parse(listStg) : [];
  }
  /**
   * @param idea - added idea
   */
  create(idea: string): void {
    pipe(
      this.read(),
      ary => [idea, ...ary],
      JSON.stringify,
      ideaStg => this.storage.setItem(this.id, ideaStg)
    );
  }
  updateAll(ideaList: string[]): void {
    this.storage.setItem(this.id, JSON.stringify(ideaList));
  }
}
