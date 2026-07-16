import { Component, input } from '@angular/core';
import { Trailer } from '../../models/trailer.model';
import { TrailerCardComponent } from '../trailer-card/trailer-card.component';

@Component({
  selector: 'app-trailer-list',
  standalone: true,
  imports: [TrailerCardComponent],
  templateUrl: './trailer-list.component.html',
  styleUrls: ['./trailer-list.component.scss'],
})
export class TrailerListComponent {
  readonly trailers = input.required<Trailer[]>();
}
