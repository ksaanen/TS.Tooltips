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

    private tooltipEl: HTMLElement;
    
    constructor(tooltip: TooltipInterface) {
      this.ref = document.querySelector(tooltip.refElement);

      this.ref.onclick = () => {
        this.onClick();
      };
    }

    setPosition() {
      let ref = this.ref.getBoundingClientRect();

      // Set top position
      this.tooltipEl.style.top = (ref.top + ref.height + 10) + 'px';

      if (ref.left + ref.width + this.tooltipEl.offsetWidth > window.innerWidth) {
        // Align right
        this.tooltipEl.classList.remove('tooltip--position-left');
        this.tooltipEl.classList.add('tooltip--position-right');
        this.tooltipEl.style.left = ((ref.left + ref.width) - this.tooltipEl.offsetWidth) + 'px';
      }
      else {
        // Align left
        this.tooltipEl.classList.remove('tooltip--position-right');
        this.tooltipEl.classList.add('tooltip--position-left');
        this.tooltipEl.style.left = ref.left + 'px';
      }
    }

    remove() {
      this.tooltipEl.remove();
    }

    private onClick() {
      // Set isOpen
      if (!this.isOpen) {
        this.isOpen = true;
        this.setPosition();
      }
    }

    private create() {

      // Tooltip instance
      let tt = this;

      // Generate the tooltip
      this.tooltipEl = document.createElement('div');
      this.tooltipEl.className = 'tooltip';

      let closeBtn = document.createElement('div');
      closeBtn.className = 'tooltip--close';
      closeBtn.addEventListener('click', function() {
        tt.isOpen = false;
      });
      this.tooltipEl.appendChild(closeBtn);
      
      if (this.header !== '') {
        let headerEl = document.createElement('div');
        headerEl.className = 'tooltip--header';
        headerEl.innerText = this.header;
        this.tooltipEl.appendChild(headerEl);
      }
      if (this.content !== '') {
        let contentEl = document.createElement('div');
        contentEl.className = 'tooltip--content';
        contentEl.innerText = this.content;
        this.tooltipEl.appendChild(contentEl);
      }

      document.querySelector('body').appendChild(this.tooltipEl);
    }

    get isOpen(): boolean {
      return this._isOpen;
    }

    set isOpen(bool: boolean) {
      this._isOpen = bool;

      if (bool === true) {
        this.create();
      }
      else {
        this.remove();
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
