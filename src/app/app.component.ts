import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  ngOnInit() {
    if (localStorage.getItem("dark")) {
      this.dark_theme = localStorage.getItem("dark") == "1" ? true : false;
      this.setTheme();
    }
  }
  dark_theme = true;
  toggleTheme() {
    this.dark_theme = !this.dark_theme;
  }
  setTheme(toggle = false) {
    toggle ? this.toggleTheme() : 0;
    if (this.dark_theme){
      document.documentElement.setAttribute("dark","1");
      localStorage.setItem("dark", '1')
    }
    else {
      document.documentElement.setAttribute("dark","0");
      localStorage.setItem("dark", '0')
    }
  }
}
