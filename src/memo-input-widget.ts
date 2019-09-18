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

@customElement("memo-input-widget")
export class MemoInputWidget extends LitElement {
  @property({ type: String }) storageID = "ideaInboxDefault";
  private ideaStorage: IdeaStorage;
  private storageInited = false;
  constructor() {
    super();
    this.ideaStorage = new EntityListStorage(this.storageID);
  }
  initStorage(id: string): void {
    if (!this.storageInited) {
      this.ideaStorage = new EntityListStorage(id);
      // flag for single init call
      this.storageInited = true;
      console.log(`ID used for storage: ${id}`);
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
    this.ideaStorage.create(newItem);
  }
  render(): TemplateResult {
    return html`
      ${CSS()}
      <div class="mdc-card">
        <mwc-textfield
          label="> Your Idea"
          @change=${this.appendItem.bind(this)}
        ></mwc-textfield>
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
