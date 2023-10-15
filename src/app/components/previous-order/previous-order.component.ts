import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PizzaService } from 'src/app/services/pizza.service';
import { Observable, switchMap } from 'rxjs';
import { Pizza } from 'src/app/types/interfaces/pizza.interfaces';

@Component({
  selector: 'app-previous-orders',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, MatButtonModule],
  templateUrl: './previous-order.component.html',
  styleUrls: ['./previous-order.component.scss']
})
export class PreviousOrdersComponent implements OnInit {
  pizzas$: Observable<Pizza[]> = new Observable<Pizza[]>()

  constructor(private pizzaService: PizzaService) {}

  ngOnInit(): void {
    this.pizzas$ = this.pizzaService.getSavedPizzas()
  }

  onDelete(id: number) {
    this.pizzas$ = this.pizzaService.deletePizza(id).pipe(
      switchMap(() => this.pizzaService.getSavedPizzas())
    )
  }
}
