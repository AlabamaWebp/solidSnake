import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  @Output() page = new EventEmitter();

  setPage(n: number) {
    this.page.emit(n)
  }
}
