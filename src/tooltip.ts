interface TooltipOptions {
  header?: string;
  content: string;
  refElement: string;
}

interface RefPosition {
  top: number;
  left: number;
  origin: number;
  width: number;
  height: number;
}

export class Tooltip {

  private ref: HTMLElement;
  private header: string;
  private content: string;
  private tooltipEl: HTMLElement;

  private windowListener: EventListener;
  private documentListener: EventListener;

  constructor(props: TooltipOptions) {
    this.ref = document.querySelector(props.refElement);
    if (props.header) {
      this.header = props.header;
    }
    if (props.content) {
      this.content = props.content;
    }
    this.ref.addEventListener('click', this.onClick.bind(this));
  }

  setPosition(): void {
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

  private getRefPosition(): RefPosition {
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
  
  private isOpen() {
    return document.body.contains(this.tooltipEl);
  }

  private remove(): void {
    if (this.isOpen()) {
      document.body.removeChild(this.tooltipEl);
      this.removeEventListeners();
    }
  }

  private onClick(): void {
    if (this.isOpen()) {
      return;
    }
    this.open();
  }

  private togglePositionClass(position: 'left'|'right'|'auto'): void {
    this.tooltipEl.classList.remove('tooltip--position-auto', 'tooltip--position-left', 'tooltip--position-right');
    this.tooltipEl.classList.add('tooltip--position-' + position);
  };

  private create(): void {
    // Generate the tooltip
    this.tooltipEl = document.createElement('div');
    this.tooltipEl.className = 'tooltip';
    let _template = `
      <div class="tooltip--close"></div>
      ${this.header ? `<div class="tooltip--header">${this.header}</div>` : ''}
      <div class="tooltip--content">${this.content}</div>
    `;
    this.tooltipEl.innerHTML = _template;
    // Append to body
    document.body.appendChild(this.tooltipEl);
  }

  private open(): void {
    this.create();
    this.setPosition();
    this.addEventListeners();
  }

  private addEventListeners(): void {
    this.tooltipEl.querySelector('.tooltip--close').addEventListener('click', (event) => {
      this.remove();
    });
    window.addEventListener('resize', this.windowListener = this.onResize.bind(this));
    document.addEventListener('click', this.documentListener = this.onClickOutsideHandler.bind(this));
  }

  private removeEventListeners(): void {
    window.removeEventListener('resize', this.windowListener);
    document.removeEventListener('click', this.documentListener);
  }

  // Close tooltip on click outside
  private onClickOutsideHandler(event: Event) {
    if (event.target instanceof Node && !this.tooltipEl.contains(event.target) && !this.ref.contains(event.target)) {
      this.remove();
    }
  }

  private onResize(): void {
    this.setPosition();
  }

}
