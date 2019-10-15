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
      let ref = this.ref.getBoundingClientRect();
      this.tooltip.style.left = ref.left + 'px';
      this.tooltip.style.top = (ref.top + ref.height + 10) + 'px';
    }

    private close() {
      this.tooltip.remove();
      console.log(this.isOpen);
    }

    private onClick() {
      // Set isOpen
      if (!this.isOpen) {
        this.isOpen = true;
        this.setPosition();
      }
    }

    private open() {
      let el = document.createElement('div');
      el.className = 'tooltip';
      let html = `<div class="tooltip--close" onclick="this.parentNode.remove()"></div>`;
      
      if (this.header !== '') {
        html += `<div class="tooltip--header">${this.header}</div>`;
      }
      if (this.content !== '') {
        html += `<div class="tooltip--content">${this.content}</div>`;
      }

      el.innerHTML = html;

      // Generate tooltip
      this.tooltip = el;
      document.querySelector('body').appendChild(this.tooltip);
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
    }

    private getOpenTooltip(): Tooltip {
      // Returns first found open tooltip (tooltips are expected to have 1 open at a time).
      return this.tooltips.filter(function (tooltip) {
        return tooltip.isOpen === true;
      })[0];
    }

    private onResize() {
      // First check if a tooltip has opened.
      if (this.getOpenTooltip()) {
        this.getOpenTooltip().setPosition();
      }
    }

  }

}
