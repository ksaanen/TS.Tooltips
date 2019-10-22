interface TooltipOptions {
  header: string;
  content: string;
  refElement: string;
  isOpen?: boolean;
}

interface RefPosition {
  top: number;
  left: number;
  origin: number;
  width: number;
  height: number;
}

export class Tooltip {

  private _isOpen: boolean;

  private ref: HTMLElement;
  private header: string;
  private content: string;
  private tooltipEl: HTMLElement;

  constructor(props: TooltipOptions) {
    this.ref = document.querySelector(props.refElement);
    if (props.header) {
      this.header = props.header;
    }
    if (props.content) {
      this.content = props.content;
    }

    this.ref.addEventListener('click', this.onClick);
    this.create();
    this.addEventListeners();
  }

  setPosition = (): void => {
    let ref = this.getRefPosition(),
      sideOffset = 14,
      tooltipMaxWidth = 340;

    // Set top position
    this.tooltipEl.style.top = (ref.top + ref.height + 13) + 'px';
    if (ref.origin + tooltipMaxWidth > window.innerWidth) {
      if (ref.origin > tooltipMaxWidth) {
        // Align right
        this.togglePositionClass('right');
        this.tooltipEl.style.left = (ref.origin + sideOffset) - this.tooltipEl.offsetWidth + 'px';
      } else {
        // Align auto
        this.togglePositionClass('auto');
        this.tooltipEl.style.left = ref.origin - this.tooltipEl.offsetWidth + 'px';
      }
    }
    else {
      // Align left
      this.togglePositionClass('left');
      this.tooltipEl.style.left = (ref.origin - sideOffset) + 'px';
    }
  }

  private getRefPosition = (): RefPosition => {
    let rect = this.ref.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    return {
      top: rect.top + scrollTop,
      left: rect.left + scrollLeft,
      origin: (rect.left + scrollLeft) + (rect.width / 2),
      height: rect.height,
      width: rect.width
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
    this.tooltipEl.className = 'tooltip-vanilla';
    let _template = `
      <div class="tooltip--close">
        X
      </div>
      <div class="tooltip--header">${this.header}</div>
      <div class="tooltip--content">${this.content}</div>
    `;
    this.tooltipEl.innerHTML = _template;
  }

  private open = (): void => {
    document.querySelector('body').appendChild(this.tooltipEl);

    window.addEventListener('resize', (event) => {
      this.onResize();
    });
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

  private onResize = (): void => {
    // First check if a tooltip has opened.
    if (this.isOpen) {
      this.setPosition();
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
      window.removeEventListener('click', this.onResize);
    }
  }

}
