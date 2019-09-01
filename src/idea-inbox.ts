import {
  LitElement,
  html,
  customElement,
  property,
  TemplateResult
} from "lit-element";
import { EntityListStorage } from "./IdeaStorage";

import "@material/mwc-textfield";

/**
 * Interface for idea storage.
 * Implimentation can use localStorage, indexDB, web service, any thing.
 */
export interface IdeaStorage {
  create: (idea: string) => void;
  read: () => string[];
  updateAll: (ideas: string[]) => void;
}

type deleteHandler = (index: number) => void;
// List
// design system: Material Design
// 1line, delete icon, separated by line
// <= Subject should identity whether this is "frequent <br>" or "list" (list should be list)
const listItem = (
  content: string,
  index: number,
  deleteHandler: deleteHandler
): TemplateResult =>
  html`
    <li class="mdc-list-item">
      <span class="mdc-list-item__text">${content}</span>
      <button
        class="mdc-list-item__meta mdc-icon-button material-icons"
        @click=${(): void => deleteHandler(index)}
      >
        <i class="mdc-icon-button__icon material-icons">
          cancel
        </i>
      </button>
    </li>
    <li role="separator" class="mdc-list-divider"></li>
  `;

const list = (
  contentList: string[],
  deleteHandler: deleteHandler
): TemplateResult =>
  html`
    <ul class="mdc-list">
      ${contentList.map((content, i) => listItem(content, i, deleteHandler))}
    </ul>
  `;

const CSS = (): TemplateResult =>
  html`
    <style>
      @import url("https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css");
      @import url("https://fonts.googleapis.com/icon?family=Material+Icons");
      /* Currently overided by MDC-web, so needs MDC-web customization flow. */
      @import url("https://fonts.googleapis.com/css?family=Noto+Sans+JP|Roboto&display=swap");
      div {
        /* Roboto do NOT contain JP => JP is "NotoSansJP" */
        font-family: "Roboto", "Noto Sans JP", sans-serif;
      }
    </style>
  `;

/**
 * Remove an item immutably in an array based on index
 * @param list - item list
 * @param index - removed index
 */
function removeIndexedItem<T>(list: T[], index: number): T[] {
  return [...list.slice(0, index), ...list.slice(index + 1, list.length)];
}

@customElement("memo-widget")
export class MemoWidget extends LitElement {
  @property({ type: String }) storageID = "ideaInboxDefault";
  @property({ type: Array }) ideaList = [""];
  private ideaStorage: IdeaStorage;
  private storageInited = false;
  constructor() {
    super();
    this.ideaStorage = new EntityListStorage(this.storageID);
    this.ideaList = this.ideaStorage.read();
  }
  initStorage(id: string): void {
    if (!this.storageInited) {
      this.ideaStorage = new EntityListStorage(id);
      // flag for single init call
      this.storageInited = true;
      console.log(`ID used for storage: ${id}`);
      this.ideaList = this.ideaStorage.read();
    }
  }
  appendItem(evt: Event): void {
    //@ts-ignore
    const inputTxt: string = evt.target.value;
    //@ts-ignore
    evt.target.value = "";
    this.ideaList = [inputTxt, ...this.ideaList];
    this.ideaStorage.create(inputTxt);
  }
  deleteItem(index: number): void {
    this.ideaList = removeIndexedItem(this.ideaList, index);
    this.ideaStorage.updateAll(this.ideaList);
  }
  render(): TemplateResult {
    return html`
      ${CSS()}
      <div class="mdc-card">
        <mwc-textfield
          label="> Your Idea"
          @change=${this.appendItem.bind(this)}
        ></mwc-textfield>
        ${list(this.ideaList, this.deleteItem.bind(this))}
      </div>
    `;
  }
  /**
   * Idea storage initiation through attribute initialization (this occur after class construction)
   */
  attributeChangedCallback(name: string, oldval: string, newval: string): void {
    if (this.storageInited == false && name == "storageid") {
      this.initStorage(newval);
    }
    super.attributeChangedCallback(name, oldval, newval);
  }
}
