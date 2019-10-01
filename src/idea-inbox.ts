import {
  LitElement,
  html,
  customElement,
  property,
  TemplateResult
} from "lit-element";
import { EntityListStorage } from "./IdeaStorage";
import "@material/mwc-textfield";
const uuidv4 = require("uuid/v4");

export interface Item {
  id: string;
  content: string;
}

/**
 * Interface for idea storage.
 * Implimentation can use localStorage, indexDB, web service, any thing.
 */
export interface IdeaStorage {
  create: (idea: Item) => void;
  read: () => Item[];
  delete: (ideaID: string) => void;
}

type deleteHandler = (itemID: string) => void;
// List
// design system: Material Design
// 1line, delete icon, separated by line
// <= Subject should identity whether this is "frequent <br>" or "list" (list should be list)
const listItem = (
  content: string,
  itemID: string,
  deleteHandler: deleteHandler
): TemplateResult =>
  html`
    <li class="mdc-list-item">
      <span class="mdc-list-item__text">${content}</span>
      <button
        class="mdc-list-item__meta mdc-icon-button material-icons"
        @click=${(): void => deleteHandler(itemID)}
      >
        <i class="mdc-icon-button__icon material-icons">
          cancel
        </i>
      </button>
    </li>
    <li role="separator" class="mdc-list-divider"></li>
  `;

const list = (items: Item[], deleteHandler: deleteHandler): TemplateResult =>
  html`
    <ul class="mdc-list">
      ${items.map(item => listItem(item.content, item.id, deleteHandler))}
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

@customElement("memo-widget")
export class MemoWidget extends LitElement {
  @property({ type: String }) storageID = "ideaInboxDefault";
  @property({ type: Array }) ideaList: Item[];
  @property({ type: Number }) inboxCount = 0;
  @property({ type: Boolean }) details = false;
  private ideaStorage: IdeaStorage;
  private storageInited = false;
  constructor() {
    super();
    this.ideaStorage = new EntityListStorage(this.storageID);
    this.ideaList = this.ideaStorage.read();
    this.inboxCount = this.ideaList.length;
  }
  initStorage(id: string): void {
    if (!this.storageInited) {
      this.ideaStorage = new EntityListStorage(id);
      // flag for single init call
      this.storageInited = true;
      console.log(`ID used for storage: ${id}`);
      this.ideaList = this.ideaStorage.read();
      this.inboxCount = this.ideaList.length;
      // regular update, which make multi-tab conflict problem #1 weaker
      const xxx = 3000;
      setInterval(
        ((): void => {
          this.ideaList = this.ideaStorage.read();
          this.inboxCount = this.ideaList.length;
        }).bind(this),
        xxx
      );
    }
  }
  appendItem(evt: Event): void {
    //@ts-ignore
    const inputTxt: string = evt.target.value;
    //@ts-ignore
    evt.target.value = "";
    const newItem: Item = {
      id: uuidv4() as string,
      content: inputTxt
    };
    this.ideaList = [newItem, ...this.ideaList];
    this.ideaStorage.create(newItem);
    this.inboxCount = this.ideaList.length;
  }
  deleteItem(itemID: string): void {
    // this.ideaStorage.
    this.ideaStorage.delete(itemID);
    this.ideaList = this.ideaStorage.read();
    this.inboxCount = this.ideaList.length;
  }
  render(): TemplateResult {
    const itemList = list(this.ideaList, this.deleteItem.bind(this));
    return html`
      ${CSS()}
      <div class="mdc-card">
        <slot name="about"></slot>
        <mwc-textfield
          label="> Your Idea"
          @change=${this.appendItem.bind(this)}
        ></mwc-textfield>
        ${this.details
          ? html`
              <details>
                <summary>items</summary>
                ${itemList}
              </details>
            `
          : itemList}
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
