namespace SomeNamespace.Vanilla.Core {

  export interface Tooltip {
    header: string;
    content: string;
    open?: boolean;
    refElement: string;
  }

  export class Tooltips {

    private tooltipsArray: Tooltip[];
    private isOpen: boolean;

    constructor() {
      this.tooltipsArray = [];

      this.init();
    }

    // Accept a Tooltip object or an array of Tooltip objects
    add(tooltips: Tooltip | Tooltip[]) {
      if (Array.isArray(tooltips)) {
        this.tooltipsArray.push(...tooltips);
      }
      else if (typeof tooltips === 'object') {
        this.tooltipsArray.push(tooltips);
      }
    }

    init() {
         
      // Add resize eventlistener to window
      window.addEventListener('resize', (e) => {
        this.onResize();
      });
    }

    private onResize() {

    }

    private show() {

    }

    private render() {

    }

  }
  
}
