import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScrollRestorationService } from './core/services/scroll-restoration.service';
import { Footer } from './layout/footer/footer';
import { Header } from './layout/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor() {
    inject(ScrollRestorationService).init();
  }
}