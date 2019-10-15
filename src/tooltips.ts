namespace SomeNamespace.Vanilla.Core {

  export interface TooltipInterface {
    header: string;
    content: string;
    refElement: string;
    isOpen?: boolean;
  }

  export class Tooltip {
   
    private _isOpen: boolean;
    private _ref: HTMLElement;
    private _header: string;
    private _content: string;

    private tooltip: HTMLElement;
    
    constructor(tooltip: TooltipInterface) {
      this.ref = document.querySelector(tooltip.refElement);

      this.ref.onclick = () => {
        this.onClick();
      };
    }

    setPosition() {

    }

    private close() {
      this.tooltip.remove();
    }

    private onClick() {
      // Set isOpen
      if (!this.isOpen) {
        this.isOpen = true;
      }
    }

    private open() {
      let el = document.createElement('div');
      el.classList.add('tooltip');
      el.innerHTML = `
        <div class="header">${this.header}</div>
        <div class="content">${this.content}</div>
      `;
      
      // Generate tooltip
      this.tooltip = el;
      document.body.append(this.tooltip);
      console.log('open');
    }

    get isOpen(): boolean {
      return this._isOpen;
    }

    set isOpen(bool: boolean) {
      this._isOpen = bool;

      if (bool === true) {
        this.open();
      }
      else {
        this.close();
      }
    }

    get ref(): HTMLElement {
      return this._ref;
    }

    set ref(el: HTMLElement) {
      this._ref = el;
    }

    get header(): string {
      return this._header;
    }

    set header(str: string) {
      this._header = str;
    }

    get content(): string {
      return this._content;
    }

    set content(str: string) {
      this._content = str;
    }

  }

  export class Tooltips {

    private tooltips: Tooltip[] = [];

    constructor() {
      this.init();
    }

    // Accept a Tooltip object or an array of Tooltip objects
    addTooltip(tooltip: TooltipInterface) {
      let t = new Tooltip(tooltip);
      this.tooltips.push(t);
    }

    private init() {
      // Add resize eventlistener to window
      window.addEventListener('resize', (e) => {
        this.onResize();
      });

      window.addEventListener('click', (e) => {
        this.onOutsideClick();
      });
    }

    private getOpenTooltip(): Tooltip {
      // Returns first found open tooltip (tooltips are expected to have 1 open at a time).
      return this.tooltips.filter(function (tooltip) {
        return tooltip.isOpen === true;
      })[0];
    }

    private onOutsideClick() {
      if (this.getOpenTooltip()) {
        this.getOpenTooltip().isOpen = false;
      }
    }

    private onResize() {
      // First check if a tooltip has opened.
      if (this.getOpenTooltip()) {
        this.getOpenTooltip().setPosition();
      }
    }

  }

}
