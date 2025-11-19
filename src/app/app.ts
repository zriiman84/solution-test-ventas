import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HelloWorld } from './hello-world/hello-world';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('solution-test-ventas');
}
