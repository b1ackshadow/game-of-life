interface Point {
  x: number,
  y: number
}
const GRID_LINE_COLOR = "gray";
const INACTIVE_CELL = "#181818";
const ACTIVE_CELL = "white";

class Grid {
  private grid: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private GRID_COLS: number = 20;
  private GRID_ROWS: number = 20;
  private scaleFactor: number;
  private GRID_CELLS:Map<string, Boolean> = new Map();

  constructor() {
    this.grid = document.getElementById("grid") as HTMLCanvasElement;
    if(!this.grid) {
      throw new Error("Failed to find canvas for `grid`")
    }
    this.ctx = this.grid.getContext('2d');
    if (!this.ctx) {
      throw new Error(`Failed to get canvas context`);
    }

    this.scaleFactor = this.grid.width / this.GRID_COLS;

    this.setupGrid();
    this.setupClickListener();
  }

  private setupGrid() {
    this.ctx!.strokeStyle = GRID_LINE_COLOR;
    this.ctx?.scale(this.scaleFactor, this.scaleFactor);
    this.ctx!.lineWidth = 0.1;

    // Draw horizontal lines
    for (let y: number = 0; y <= this.GRID_ROWS; y++) {
      this.ctx?.beginPath();
      this.ctx?.moveTo(0, y);
      this.ctx?.lineTo(this.GRID_COLS, y);
      this.ctx?.stroke();
    }

    // Draw vertical lines
    for (let x: number = 0; x <= this.GRID_COLS; x++) {
      this.ctx?.beginPath();
      this.ctx?.moveTo(x, 0);
      this.ctx?.lineTo(x, this.GRID_ROWS);
      this.ctx?.stroke();
    }

    console.log(`Canvas width: ${this.grid.width}, Canvas height: ${this.grid.height}`);
    console.log(`Scale Factor = ${this.scaleFactor}`);
  }

  private setupClickListener() {
    this.grid.addEventListener('click', (event) => {
      const rect = this.grid.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      console.log(`Clicked (${x},${y})`);

      const cellX = Math.floor(x / this.scaleFactor);
      const cellY = Math.floor(y / this.scaleFactor);
      const point = { x: cellX, y: cellY } as Point;
      this.toggleCell(point);
    });
    
  }

  private toggleCell(point: Point) {
    let cellStatus: Boolean;
    if (this.getCell(point)) {
      this.deleteCell(point);
      cellStatus = false;
    } else {
      // mark it
      this.setCell(point);
      cellStatus = true;
    }
    const fillStyle = cellStatus? ACTIVE_CELL: INACTIVE_CELL;
    this.ctx!.fillStyle = fillStyle;
    this.ctx!.fillRect(point.x + 0.06, point.y + 0.06, 0.88, 0.88); // Drawing a 1x1 pixel in the scaled context
  }

  private getCell(point: Point): Boolean | undefined {
    const key = this.pointToKey(point);
    return this.GRID_CELLS.get(key);
  }

  private setCell(point: Point) {
    const key = this.pointToKey(point);
    this.GRID_CELLS.set(key, true);
  }

  private deleteCell(point: Point) {
    const key = this.pointToKey(point);
    this.GRID_CELLS.delete(key);
  }

  private pointToKey(point: Point): string {
    return `${point.x},${point.y}`;
  }
}

// Instantiate the Grid class
(() => {
  new Grid();
})()

function drawCell(point: any, Point: any) {
  throw new Error("Function not implemented.");
}
