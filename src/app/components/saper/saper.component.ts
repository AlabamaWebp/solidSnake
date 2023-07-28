import { Component, EventEmitter, HostListener, Output } from '@angular/core';

@Component({
  selector: 'app-saper',
  templateUrl: './saper.component.html',
  styleUrls: ['./saper.component.scss']
})
export class SaperComponent {
  constructor() { }

  @Output() page = new EventEmitter();
  goToSnake() {
    this.page.emit(1);
  }

  ngOnInit(): void {
    this.initLocalStorage();
  }

  // ngOnInit() {
  //   if (localStorage.getItem("dark")) {
  //     this.dark_theme = localStorage.getItem("dark") == "1" ? true : false;
  //     this.setTheme();
  //   }
  // }
  dark_theme = true;
  toggleTheme() {
    this.dark_theme = !this.dark_theme;
  }
  setTheme(toggle = false) {
    toggle ? this.toggleTheme() : 0;
    if (this.dark_theme) {
      document.documentElement.setAttribute("dark", "1");
      localStorage.setItem("dark", '1')
    }
    else {
      document.documentElement.setAttribute("dark", "0");
      localStorage.setItem("dark", '0')
    }
  }

  ngAfterViewInit() {
    // setTimeout(() => {
    //   this.raschet();
    // }, 10);
  }

  changeFieldSize() {
    const x = this.x;
    const y = this.y;
    this.field = []
    for (let i = 0; i < y; i++) {
      let tmp = []
      for (let j = 0; j < x; j++) {
        tmp.push({ colId: j, fill: '' })
      }
      this.field.push({ rowId: i, cols: tmp })
    }
  }

  pages = [1];
  field: any = [];
  // settings = false;
  x = 47;
  y = 20;

  game_started = false;
  bals = 0;
  // max_bals = 0;
  endgame_text = '';

  raschet() {
    const el = document.getElementById('game_container') as HTMLElement;

    this.setFieldX(Math.floor(el.clientWidth / (this.cell_size + 3)));
    this.setFieldY(Math.floor((el.clientHeight / (this.cell_size + 3))));
    this.changeFieldSize();
    this.bombRaschet();
  }
  getCenter() {
    return [{
      x: (this.x - this.x % 2) / 2,
      y: (this.y - this.y % 2) / 2
    },
    {
      x: (this.x - this.x % 2) / 2 + 1,
      y: (this.y - this.y % 2) / 2
    },
    ]
  }
  colorChange(x: number, y: number, color: string = "") {
    const elMass = document.getElementsByClassName("x" + x) as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < elMass.length; i++) {
      if (elMass[i].className.includes("y" + y + "! ")) {
        elMass[i].style.backgroundColor = color;
      }
    }
  }
  getRand(max: number) {
    return Math.floor(Math.random() * max);
  }
  createRandPos() {
    return {
      x: this.getRand(this.x),
      y: this.getRand(this.y)
    }
  }
  clearField() {
    for (let i = 0; i < this.x; i++) {
      for (let j = 0; j < this.y; j++) {
        this.colorChange(i, j);
      }
    }
  }
  setCellSize(n: number) {
    this.cell_size = n - 4;
    this.raschet();
    localStorage.setItem("cell_size_s", this.cell_size + "")
  }
  initLocalStorage() {
    // if (localStorage.getItem("sapr_max")) {
    //   this.max_bals = Number(localStorage.getItem("sapr_max"));
    // }
    if (localStorage.getItem("cell_size_sapr")) {
      this.cell_size = Number(localStorage.getItem("cell_size_sapr"));
    }
    if (localStorage.getItem("bombs")) {
      this.bombs = Number(localStorage.getItem("bombs"));
    }
    if (localStorage.getItem("sapr_x")) {
      this.x = Number(localStorage.getItem("sapr_x"));
    }
    if (localStorage.getItem("sapr_y")) {
      this.y = Number(localStorage.getItem("sapr_y"));
    }
    if (localStorage.getItem("bombs_del")) {
      this.bomb_del = Number(localStorage.getItem("bombs_del"));
      setTimeout(() => {
        this.bombRaschet();
      }, 10);
    }
    if (localStorage.getItem("save_saper")) {
      this.load_lc = true
    }

    if (localStorage.getItem("dark")) {
      this.dark_theme = localStorage.getItem("dark") == "1" ? true : false;
      this.setTheme();
    }
    this.changeFieldSize();
  }
  load_lc = false;
  cell_size = 36;
  bombs = 20;
  setBombs(n: number) {
    this.bombs = n;
    localStorage.setItem("bombs", n + "");
    localStorage.removeItem("bombs_del")
  }
  clickCell(data: { x: number, y: number }) {
    if (data.x >= this.x || data.y >= this.y || data.x < 0 || data.y < 0) {
      return;
    }
    // НЕНАДЁЖНО!!!!!!!!!!
    // const ref = document.getElementsByClassName("x" + data.x + " y" + data.y + "!")[0];
    const ref = document.getElementById("y" + data.y + "! " + "x" + data.x) as HTMLElement;
    if (this.game_started && !ref.className.includes("clicked") && !ref.className.includes("metka")) {

      for (let i = 0; i < this.bombs_coord.length; i++) {
        if (this.bombs_coord[i].x == data.x && this.bombs_coord[i].y == data.y) {
          this.stop();
          this.endgame_text = '!!!!!!!!Взрыв!!!!!!!!';
          this.colorChange(data.x, data.y, "red");
          return;
        }
      }

      let n = 0;
      for (let i = 0; i < this.bombs_coord.length; i++) {

        if (this.bombs_coord[i].x == data.x + 1 && this.bombs_coord[i].y == data.y) {
          n++;
          // console.log("x+1", this.bombs_coord[i]);
          // this.colorChange(this.bombs_coord[i].x,this.bombs_coord[i].y,"green !important");
          continue;
        }
        if (this.bombs_coord[i].x == data.x - 1 && this.bombs_coord[i].y == data.y) {
          n++;
          // console.log("x-1",this.bombs_coord[i]);
          // this.colorChange(this.bombs_coord[i].x,this.bombs_coord[i].y,"green !important");
          continue;
        }
        if (this.bombs_coord[i].x == data.x && this.bombs_coord[i].y == data.y + 1) {
          n++;
          // console.log("y-1", this.bombs_coord[i]);
          // this.colorChange(this.bombs_coord[i].x,this.bombs_coord[i].y,"green !important");
          continue;
        }
        if (this.bombs_coord[i].x == data.x && this.bombs_coord[i].y == data.y - 1) {
          n++;
          // console.log("y+1", this.bombs_coord[i]);
          // this.colorChange(this.bombs_coord[i].x,this.bombs_coord[i].y,"green !important");
          continue;
        }
        if (this.bombs_coord[i].x == data.x - 1 && this.bombs_coord[i].y == data.y - 1) {
          n++;
          // console.log("x-1,y-1", this.bombs_coord[i]);
          // this.colorChange(this.bombs_coord[i].x,this.bombs_coord[i].y,"green !important");
          continue;
        }
        if (this.bombs_coord[i].x == data.x - 1 && this.bombs_coord[i].y == data.y + 1) {
          n++;
          // console.log("x-1,y+1", this.bombs_coord[i]);
          // this.colorChange(this.bombs_coord[i].x,this.bombs_coord[i].y,"green !important");
          continue;
        }
        if (this.bombs_coord[i].x == data.x + 1 && this.bombs_coord[i].y == data.y + 1) {
          n++;
          // console.log("x+1,y+1", this.bombs_coord[i]);
          // this.colorChange(this.bombs_coord[i].x,this.bombs_coord[i].y,"green !important");
          continue;
        }
        if (this.bombs_coord[i].x == data.x + 1 && this.bombs_coord[i].y == data.y - 1) {
          n++;
          // console.log("x+1,y-1", this.bombs_coord[i]);
          // // this.colorChange(this.bombs_coord[i].x,this.bombs_coord[i].y,"green !important");
          continue;
        }
      }
      this.colorChange(data.x, data.y, "white");
      let el = document.createElement("div");
      n == 0 ? 0 : el.innerText = n + "";
      el.classList.add('center');
      ref.appendChild(el);
      ref.classList.add("clicked");
      ref.classList.remove('hidden1');
      this.open_cells.push({ x: data.x, y: data.y })
      document.getElementById('save')?.removeAttribute("disabled");
      if (n == 0) {
        this.clickCell({ x: data.x + 1, y: data.y });
        this.clickCell({ x: data.x - 1, y: data.y });
        this.clickCell({ x: data.x, y: data.y + 1 });
        this.clickCell({ x: data.x, y: data.y - 1 });
        this.clickCell({ x: data.x + 1, y: data.y - 1 });
        this.clickCell({ x: data.x + 1, y: data.y + 1 });
        this.clickCell({ x: data.x - 1, y: data.y + 1 });
        this.clickCell({ x: data.x - 1, y: data.y - 1 });
      }
      if (this.bombs == document.getElementsByClassName('hidden1').length) {
        this.stop();
        this.endgame_text = '!!!!!!!!Победа!!!!!!!!';
      }
    }
  }
  open_cells: xy[] = []
  return_settings() {
    this.cell_size = 36;
    this.bombs = 20;
  }
  bombs_coord: xy[] = [];
  start() {
    this.bombs_coord = []
    this.metki = [];
    this.open_cells = [];
    this.bals = 0;

    this.endgame_text = '';
    this.changeFieldSize();
    for (let i = 0; i < this.bombs; i++) {
      let tmp = this.createRandPos();
      while (this.checkBombCoord(tmp)) {
        tmp = this.createRandPos();
      }
      this.bombs_coord.push(tmp);
    }

    this.game_started = true;
  }
  checkBombCoord(bomb: { x: number, y: number }) {
    for (let i = 0; i < this.bombs_coord.length; i++) {
      if (this.bombs_coord[i].x == bomb.x && this.bombs_coord[i].y == bomb.y) {
        stop
        return true;
      }
    }
    return false;
  }

  stop() {
    this.game_started = false;
  }
  bomb_del = 40;
  setBombDel(n: number) {
    this.bomb_del = n;
    localStorage.setItem("bombs_del", n + "");
    localStorage.removeItem("bombs");
  }
  bombRaschet() {
    this.bombs = Math.floor((this.x * this.y) * (this.bomb_del / 100));
  }
  auxClick(ref: HTMLElement, data: { x: number, y: number }) {
    ref.classList.toggle('metka');
    if (ref.className.includes("metka")) {
      this.metki.push(data);
      this.bals++;
    }
    else {
      this.metki.splice(this.metki.findIndex(m => m.x == data.x && m.y == data.y), 1);
      this.bals--;
    }
  }
  auxTouch(ref: HTMLElement, data: { x: number, y: number }) {
    if (!this.is_aux) {
      ref.classList.toggle('metka');
      if (ref.className.includes("metka")) {
        this.metki.push(data);
        this.bals++;
      }
      else {
        this.metki.splice(this.metki.findIndex(m => m.x == data.x && m.y == data.y), 1);
        this.bals--;
      }
      this.is_aux = true;
    }
  }
  is_aux = false;

  metki: { x: number, y: number }[] = [];
  @HostListener('window:keyup', ["$event"])
  keeylistner(ev: KeyboardEvent) {
    if ((ev.key == "Enter" || ev.key == " ") && !this.game_started) {
      this.start();
    }
  }
  setFieldX(n: number) {
    this.x = n;
    localStorage.setItem("sapr_x", n + "");
    this.changeFieldSize();
  }
  setFieldY(n: number) {
    this.y = n;
    localStorage.setItem("sapr_y", n + "")
    this.changeFieldSize();
  }

  save() {
    let bombs_coord = '';
    for (let i = 0; i < this.bombs_coord.length; i++) {
      bombs_coord += `${this.bombs_coord[i].x},${this.bombs_coord[i].y}/`;
    }
    let metka_coord = '';
    for (let i = 0; i < this.metki.length; i++) {
      metka_coord += `${this.metki[i].x},${this.metki[i].y}/`;
    }
    let open_c = '';
    for (let i = 0; i < this.open_cells.length; i++) {
      open_c += `${this.open_cells[i].x},${this.open_cells[i].y}/`;
    }
    bombs_coord = bombs_coord.slice(0, bombs_coord.length - 1);
    metka_coord = metka_coord.slice(0, metka_coord.length - 1);
    open_c = open_c.slice(0, open_c.length - 1);
    const save = `${this.x};${this.y};${this.bombs};${bombs_coord};${metka_coord};${open_c}`;
    // ;${this.acceleration}
    localStorage.setItem("save_saper", save);
    document.getElementById('save')?.setAttribute("disabled", "");
    this.load_lc = true;
  }
  load() {
    this.bombs_coord = []
    this.metki = [];
    this.open_cells = [];
    this.bals = 0;
    this.stop();
    const data = localStorage.getItem("save_saper");
    if (data) {
      let m = data.split(';');

      this.x = Number(m[0]);
      this.y = Number(m[1]);
      console.log(m);

      this.bombs = Number(m[2]);

      this.bombs_coord = [];
      const bombs_c = m[3].split('/');
      for (let i = 0; i < bombs_c.length; i++) {
        const tmp_b = bombs_c[i].split(',');
        this.bombs_coord.push({
          x: Number(tmp_b[0]),
          y: Number(tmp_b[1]),
        });
      }


      this.endgame_text = '';
      this.changeFieldSize();

      if (m[4].length != 0) {
        this.metki_load = [];
        const metki_c = m[4].split('/');
        for (let i = 0; i < metki_c.length; i++) {
          const tmp_m = metki_c[i].split(',');
          this.metki_load.push({
            x: Number(tmp_m[0]),
            y: Number(tmp_m[1]),
          });
        }
        setTimeout(() => {
          this.setMetki();
        }, 10);
      }

      this.open_cells_load = [];
      const op_c = m[5].split('/');
      for (let i = 0; i < op_c.length; i++) {
        const tmp_c = op_c[i].split(',');
        this.open_cells_load.push({
          x: Number(tmp_c[0]),
          y: Number(tmp_c[1]),
        });
      }
    }
    console.log(this.metki_load);
    console.log(this.open_cells_load);

    setTimeout(() => {
      this.setOpenCells();
    }, 10);
    this.game_started = true;
  }

  open_cells_load: xy[] = [];
  metki_load: xy[] = [];

  setOpenCells() {
    for (let i = 0; i < this.open_cells_load.length; i++) {
      // const ref = document.getElementById("y" + this.open_cells_load[i].y + "! " + "x" + this.open_cells_load[i].x) as HTMLElement;
      this.clickCell({ x: this.open_cells_load[i].x, y: this.open_cells_load[i].y })
    }
  }

  setMetki() {
    for (let i = 0; i < this.metki_load.length; i++) {
      const ref = document.getElementById("y" + this.metki_load[i].y + "! " + "x" + this.metki_load[i].x) as HTMLElement;
      console.log(ref, "y" + this.metki_load[i].y + "! " + "x" + this.metki_load[i].x);

      this.auxClick(ref, { x: this.metki_load[i].x, y: this.metki_load[i].y });
    }
  }

  // checkBomb(x: number, y: number) {
  //   for (let i = 0; i < this.bombs_coord.length; i++) {
  //     if (this.bombs_coord[i].x == x && this.bombs_coord[i].y == y) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }
}

export interface xy {
  x: number,
  y: number
}