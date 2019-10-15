namespace SomeNamespace.Vanilla.Core {

  export class Tooltip {
    header: string;
    content: string;
    refElement: string;
    
    private _isOpen: boolean;
    private _ref: HTMLElement;
    
    constructor(tooltip: Tooltip) {
      this.ref = document.querySelector(tooltip.refElement);

      this.ref.onclick = () => {
        this.onClick();
      };
    }

    positionTooltip() {
      console.log('bla', this.ref);
    }

    private onClick() {
      // Set isOpen
      if (!this.isOpen) {
        this.isOpen = true;
      }

      this.show();
    }

    private show() {
      let el = document.createElement('div');
      el.classList.add('tooltip');
      el.innerHTML = `
        <div class="header">${this.header}</div>
        <div class="content">${this.content}</div>
      `;
      return el;
    }

    
    get isOpen(): boolean {
      return this._isOpen;
    }

    set isOpen(bool: boolean) {
      this._isOpen = bool;
    }

    get ref(): HTMLElement {
      return this._ref;
    }

    set ref(el: HTMLElement) {
      this._ref = el;
    }

  }

  export class Tooltips {

    private tooltips: Tooltip[] = [];

    constructor() {
      this.init();
    }

    // Accept a Tooltip object or an array of Tooltip objects
    addTooltip(tooltip: Tooltip) {
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
        this.getOpenTooltip().positionTooltip();
      }
    }

  }

}
