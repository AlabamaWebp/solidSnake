import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor() { }

  ngOnInit(): void {
    this.initLocalStorage();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.raschet();
    }, 10);
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

  raschet() {
    const el = document.getElementById('game_container') as HTMLElement;

    this.x = Math.floor(el.clientWidth / (this.cell_size + 5 + 4));
    this.y = Math.floor((el.clientHeight / (this.cell_size + 5 + 4)));
    this.changeFieldSize();
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
      if (elMass[i].className.includes("y" + y + "!")) {
        elMass[i].style.backgroundColor = color;
      }
    }
  }
  game_started = false;
  stopSnake() {
    console.log(this.game_interval);
    this.intervalStop();
    this.clearField();
    this.game_started = false;
    this.napravlenie = 1;
    this.game_speed = this.norm_game_speed;
    if (this.max_bals < this.bals) {
      this.max_bals = this.bals;
      localStorage.setItem("snake_max", this.max_bals + "");
    }
    this.bals = 0;
  }
  refreshInterval() {
    this.intervalStop();
    this.intervalGo();
  }
  intervalGo() {
    this.game_interval = setInterval(() => {
      this.gameTick();
    }, this.game_speed);
  }
  intervalStop() {
    clearInterval(this.game_interval);
  }
  startSnake() {
    this.norm_game_speed = this.game_speed;
    const coord = this.getCenter();
    this.colorChange(coord[0].x, coord[0].y, "green");
    this.colorChange(coord[1].x, coord[1].y, "green");
    this.game_snake = coord;
    this.createTarget();
    this.intervalGo();
    this.game_started = true;
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
  createTarget() {
    let t = this.createRandPos();
    for (let i = 0; i < this.game_snake.length; i++) {
      if (this.game_snake[i].x == t.x && this.game_snake[i].y == t.y) {
        t = this.createRandPos();
        i = 0;
      }
    }
    this.game_speed -= this.speed_up;
    this.refreshInterval();
    this.target = t;
    ++this.bals;
  }
  target: { x: number, y: number } = this.createRandPos();
  game_snake: { x: number, y: number }[] = [];
  norm_game_speed = 300;
  game_speed = 180;
  speed_up = 2;
  game_interval: any;
  napravlenie: number = 1;
  bals = 0;
  max_bals = 0;
  gameTick() {
    this.createNewSnake();
  }
  createNewSnake() {
    this.napravlenie = this.tmp_napravlenie;
    switch (this.napravlenie) {
      case 0:
        this.game_snake.unshift({ x: this.game_snake[0].x, y: this.game_snake[0].y - 1 });
        break;
      case 1:
        this.game_snake.unshift({ x: this.game_snake[0].x + 1, y: this.game_snake[0].y });
        break;
      case 2:
        this.game_snake.unshift({ x: this.game_snake[0].x, y: this.game_snake[0].y + 1 });
        break;
      case 3:
        this.game_snake.unshift({ x: this.game_snake[0].x - 1, y: this.game_snake[0].y });
        break;
    }
    if (this.game_snake[0].x == this.target.x && this.game_snake[0].y == this.target.y) {
      this.createTarget();
    }
    else {
      this.game_snake.pop();
    }
    if (this.game_snake[0].x > this.x
      || this.game_snake[0].x < 0
      || this.game_snake[0].y > this.y
      || this.game_snake[0].y < 0) {
      this.stopSnake();
      alert("Вы проиграли");
      return;
    }
    for (let i = 0; i < this.game_snake.length; i++) {
      if ((this.game_snake[0].x == this.game_snake[i == 0 ? 1 : i].x && this.game_snake[0].y == this.game_snake[i == 0 ? 1 : i].y)) {
        this.stopSnake();
        alert("Вы проиграли");
        return;
      }
    }
    this.refreshSnakeColors();
    return;
  }
  refreshSnakeColors() {
    this.clearField();
    this.colorChange(this.target.x, this.target.y, "red");
    for (let i = 0; i < this.game_snake.length; i++) {
      this.colorChange(this.game_snake[i].x, this.game_snake[i].y, "green");
    }
  }
  clearField() {
    for (let i = 0; i < this.x; i++) {
      for (let j = 0; j < this.y; j++) {
        this.colorChange(i, j);
      }
    }
  }
  tmp_napravlenie = this.napravlenie;
  @HostListener('window:keyup', ['$event'])
  changeNapravlenie(ev: any) {
    switch (ev.key) {
      case 'w':
        this.napravlenie != 2 ? this.tmp_napravlenie = 0 : 0;
        return;
      case 'd':
        this.napravlenie != 3 ? this.tmp_napravlenie = 1 : 0;
        return;
      case 's':
        this.napravlenie != 0 ? this.tmp_napravlenie = 2 : 0;
        return;
      case 'a':
        this.napravlenie != 1 ? this.tmp_napravlenie = 3 : 0;
        return;
      case 'ArrowUp':
        this.napravlenie != 2 ? this.tmp_napravlenie = 0 : 0;
        return;
      case 'ArrowRight':
        this.napravlenie != 3 ? this.tmp_napravlenie = 1 : 0;
        return;
      case 'ArrowDown':
        this.napravlenie != 0 ? this.tmp_napravlenie = 2 : 0;
        return;
      case 'ArrowLeft':
        this.napravlenie != 1 ? this.tmp_napravlenie = 3 : 0;
        return;
    }
  }
  return_settings() {
    this.norm_game_speed = 300;
    this.game_speed = 300;
    this.speed_up = 10;
  }
  cell_size = 26;
  setCellSize(n: number) {
    this.cell_size = n - 4;
    this.raschet();
    localStorage.setItem("cell_size_s", this.cell_size + "")
  }
  setGameSpeed(n: number) {
    this.game_speed = n;
    localStorage.setItem("game_speed_s", n + "")
  }
  setSpeedUp(n: number) {
    this.speed_up = n;
    localStorage.setItem("speed_up_s", n + "")
  }
  initLocalStorage() {
    if (localStorage.getItem("snake_max")) {
      this.max_bals = Number(localStorage.getItem("snake_max"));
    }
    if (localStorage.getItem("cell_size_s")) {
      this.cell_size = Number(localStorage.getItem("cell_size_s"));
    }
    if (localStorage.getItem("speed_up_s")) {
      this.speed_up = Number(localStorage.getItem("speed_up_s"));
    }
    if (localStorage.getItem("game_speed_s")) {
      this.game_speed = Number(localStorage.getItem("game_speed_s"));
    }
  }
  is_pause = false;
  pauseSnake() {
    this.is_pause = !this.is_pause;
    this.is_pause ? this.intervalStop() : this.intervalGo();
  }
  saveSnake() {
    const apple = `${this.target.x},${this.target.y}`
    let snake = '';
    for (let i = 0; i < this.game_snake.length; i++) {
      snake += `${this.game_snake[i].x},${this.game_snake[i].y}/`;
    }
    snake = snake.slice(0, snake.length - 1);
    const save = `${this.x};${this.y};${snake};${apple};${this.bals};${this.game_speed}`;
    localStorage.setItem("save", save);
    document.getElementById('save')?.setAttribute("disabled", "")
  }
  loadSnake() {
    const data = localStorage.getItem("save");
    if (data) {
      let m = data.split(';');
      this.x = Number(m[0]);
      this.y = Number(m[1]);
      const snake = m[2].split('/');
      this.game_snake = []
      for (let i = 0; i < snake.length; i++) {
        const tmp_snake = snake[i].split(',');
        this.game_snake.push({
          x: Number(tmp_snake[0]),
          y: Number(tmp_snake[1]),
        });
      }
      const tmp_t = m[3].split(',');
      this.target = { x: Number(tmp_t[0]), y: Number(tmp_t[1]) };
      this.bals = Number(m[4]);
      this.game_speed = Number(m[5]);
    }
    this.changeFieldSize();
    this.refreshSnakeColors();

    // this.startSnake();
  }
}
