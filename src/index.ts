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
  private GRID_COLS: number = 40;
  private GRID_ROWS: number = 40;
  private scaleFactor: number;
  //private GRID_CELLS:Map<string, Boolean> = new Map();
  private GRID_CELLS:boolean[][] = Array(this.GRID_ROWS).fill(null).map(() => Array(this.GRID_COLS).fill(false));

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
    this.setupEvolveListener();
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

      const cellX = Math.floor(x / this.scaleFactor);
      const cellY = Math.floor(y / this.scaleFactor);
      const point = { x: cellX, y: cellY } as Point;
      this.toggleCell(point);
    });
    
  }

  private setupEvolveListener() {
    const evolve = document.getElementById('evolve') as HTMLElement | null;
    evolve?.addEventListener('click', (event) => {
      //event.preventDefault();
      let interval = setInterval(() => {
        this.evolve();
        this.render();
      }, 600)
    })
  }

  private render() {
    for(let x=0; x<this.GRID_COLS; ++x) {
      for(let y=0; y<this.GRID_ROWS; ++y) {
        //this.GRID_CELLS[x][y] = !this.GRID_CELLS[x][y];
        const fillStyle = this.GRID_CELLS[x][y]? ACTIVE_CELL: INACTIVE_CELL;
        this.ctx!.fillStyle = fillStyle;
        this.ctx!.fillRect(x + 0.06, y + 0.06, 0.88, 0.88); // Drawing a 1x1 pixel in the scaled context
      }
    }
  }

  private toggleCell(point: Point) {
    const { x, y } = point;
    this.GRID_CELLS[x][y] = !this.GRID_CELLS[x][y];
    const fillStyle = this.GRID_CELLS[x][y]? ACTIVE_CELL: INACTIVE_CELL;
    this.ctx!.fillStyle = fillStyle;
    this.ctx!.fillRect(point.x + 0.06, point.y + 0.06, 0.88, 0.88); // Drawing a 1x1 pixel in the scaled context
  }

  private evolve() {
    // for current state of the grid
      // for each alive cell get the total neightbhors
    const gridClone = this.GRID_CELLS.map(row => row.slice());
    console.log(gridClone)
    for(let x=0; x<this.GRID_ROWS; ++x) {
      for(let y=0; y<this.GRID_COLS; ++y) {
        const neighbors = [
          [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
          [x - 1, y],                 [x + 1, y],
          [x - 1, y + 1], [x, y + 1], [x + 1, y + 1]
        ];

        let liveNeighbors = 0;

        neighbors.forEach(([nx, ny]) => {
          if(nx >= 0 && nx < this.GRID_COLS) {
            if(ny >= 0 && ny < this.GRID_ROWS) {
              if(this.GRID_CELLS[nx][ny]) {
                console.log(`${x}${y} Found at ${nx}${ny}`)
                liveNeighbors++;
              }
            }
          }
        });

        if(this.GRID_CELLS[x][y]) {
          if(liveNeighbors < 2 || liveNeighbors > 3) {
            gridClone[x][y] = false;
          }
        } else {
          if(liveNeighbors === 3) {
            gridClone[x][y] = true;
          }
        }
      }
    }
    // once done update grid cells
    this.GRID_CELLS = gridClone;
  }
}

// Instantiate the Grid class
(() => {
  new Grid();
})()

function drawCell(point: any, Point: any) {
  throw new Error("Function not implemented.");
}
