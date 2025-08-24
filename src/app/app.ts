import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AppNavComponent} from './components/navigation/app-nav/app-nav';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppNavComponent],
  templateUrl: './app.html',
  styleUrl: './app.sass'
})
export class App {
  protected readonly title = signal('familyFlow');
}
