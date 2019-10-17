namespace SomeNamespace.Vanilla.Core {

  export interface TooltipInterface {
    header: string;
    content: string;
    refElement: string;
    isOpen?: boolean;
  }

  export class Tooltip {

    private _isOpen: boolean;

    private ref: HTMLElement;
    private header: string;
    private content: string;
    private tooltipEl: HTMLElement;

    constructor(tooltip: TooltipInterface) {
      this.ref = document.querySelector(tooltip.refElement);
      if (tooltip.header) {
        this.header = tooltip.header;
      }
      if (tooltip.content) {
        this.content = tooltip.content;
      }

      this.ref.addEventListener('click', this.onClick);
      this.create();
      this.addEventListeners();
    }

    setPosition = (): void => {
      let ref = this.ref.getBoundingClientRect();

      // Set top position
      this.tooltipEl.style.top = (ref.top + ref.height + 10) + 'px';

      if (ref.left + ref.width + this.tooltipEl.offsetWidth > window.innerWidth) {
        let origin = (ref.left + ref.width) - this.tooltipEl.offsetWidth;
        if (origin < 0) {
          // Align auto
          this.togglePositionClass('auto');
          this.tooltipEl.style.left = ((ref.left + ref.width) - this.tooltipEl.offsetWidth) + 'px';
        } else {
          // Align right
          this.togglePositionClass('right');
          this.tooltipEl.style.left = ((ref.left + ref.width) - this.tooltipEl.offsetWidth) + 'px';
        }
      }
      else {
        // Align left
        this.togglePositionClass('left');
        this.tooltipEl.style.left = ref.left + 'px';
      }
    }

    private remove = (): void => {
      if (document.body.contains(this.tooltipEl)) {
        document.body.removeChild(this.tooltipEl);
      }
    }

    private onClick = (event: Event): void => {
      // Set isOpen
      if (!this.isOpen) {
        this.isOpen = true;
        this.setPosition();
      }
    }

    private togglePositionClass = (position: 'left'|'right'|'auto'): void => {
      this.tooltipEl.classList.remove('tooltip--position-auto', 'tooltip--position-left', 'tooltip--position-right');
      this.tooltipEl.classList.add('tooltip--position-' + position);
    };

    private create = (): void => {
      // Generate the tooltip
      this.tooltipEl = document.createElement('div');
      this.tooltipEl.className = 'tooltip';
      let _template = `
        <div class="tooltip--close">
          <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 535.771 535.747" enable-background="new 0 0 535.771 535.747" xml:space="preserve"><title>ClosePanel_grey</title><path fill="#4B4B4B" fill-opacity="0.4" d="M459.142,76.633c-103.6-103.6-273.221-101.949-378.824,3.685 c-105.634,105.604-107.285,275.21-3.686,378.795h0.016c103.6,103.601,273.191,101.95,378.811-3.685 C561.078,349.824,562.744,180.218,459.142,76.633z M367.14,335.367c8.65,8.649,8.576,22.739-0.266,31.581 c-8.813,8.842-22.842,9.063-31.609,0.295l-62.484-62.484l-63.707,63.707c-8.828,8.828-22.916,9.049-31.611,0.354 c-8.648-8.62-8.59-22.665,0.34-31.61l63.736-63.722l-62.484-62.484c-8.664-8.65-8.605-22.738,0.268-31.581 c8.797-8.842,22.826-9.063,31.58-0.294l62.484,62.483l63.723-63.707c8.813-8.827,22.916-9.033,31.609-0.339 c8.65,8.621,8.605,22.665-0.34,31.61l-63.707,63.708l-0.014-0.001L367.14,335.367z"></path></svg>
        </div>
        <div class="tooltip--header">${this.header}</div>
        <div class="tooltip--content">${this.content}</div>
      `;
      this.tooltipEl.innerHTML = _template;
    }

    private open = (): void => {
      document.querySelector('body').appendChild(this.tooltipEl);
    }

    private addEventListeners = (): void => {
      this.tooltipEl.querySelector('.tooltip--close').addEventListener('click', (event) => {
        this.isOpen = false;
      });
      
      document.addEventListener('click', (event) => {
        this.onClickOutsideHandler(event);
      });
    }

    // Close tooltip on click outside
    private onClickOutsideHandler = (event: Event) => {
      if (event.target instanceof Node && !this.tooltipEl.contains(event.target) && !this.ref.contains(event.target)) {
        this.isOpen = false;
      }
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
        this.remove();
        document.removeEventListener('click', this.onClickOutsideHandler);
      }
    }

  }

  export class Tooltips {

    private tooltips: Tooltip[] = [];

    constructor() {
      this.init();
    }

    // Accept a Tooltip object or an array of Tooltip objects
    addTooltip = (tooltip: TooltipInterface) => {
      let t = new Tooltip(tooltip);
      this.tooltips.push(t);
    }

    private init = (): void => {
      // Add resize eventlistener to window
      window.addEventListener('resize', (event) => {
        this.onResize();
      });
    }

    private getOpenTooltip = (): Tooltip => {
      // Returns first found open tooltip (tooltips are expected to have 1 open at a time).
      return this.tooltips.filter((tooltip) => {
        return tooltip.isOpen === true;
      })[0];
    }

    private onResize = (): void => {
      // First check if a tooltip has opened.
      if (this.getOpenTooltip()) {
        this.getOpenTooltip().setPosition();
      }
    }

  }

}
