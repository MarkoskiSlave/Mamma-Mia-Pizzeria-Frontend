import { PizzaService } from './../../services/pizza.service'
import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core'
import { CommonModule } from '@angular/common'
import { Ingredient } from 'src/app/types/enums/ingredient.enum'
import { MatListModule } from '@angular/material/list'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { NormalizeEnumPipe } from '../../pipes/normalize-enum.pipe'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { PizzaSize } from 'src/app/types/enums/pizza-size.enum'
import { MatStepper } from '@angular/material/stepper'
import { Pizza } from '../../types/interfaces/pizza.interfaces'
import { calculatePizzaPrice } from 'src/app/helpers/calculate-price.helper'
import { Subscription } from 'rxjs'

@Component({
    selector: 'app-selected-ingredients',
    standalone: true,
    imports: [
        CommonModule,
        MatListModule,
        MatButtonModule,
        MatIconModule,
        NormalizeEnumPipe,
        MatButtonToggleModule,
    ],
    templateUrl: './selected-ingredients.component.html',
    styleUrls: ['./selected-ingredients.component.scss'],
})
// Each lifecycle method needs to be specified in "implements" in order to be used
export class SelectedIngredientsComponent
    implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
    // List of all selected ingredients. Inputs should NEVER be mutated (changed) in the component, rather from the parent component that is passing the data in.
    @Input() selectedIngredients: Ingredient[] = []
    // Event emitter that will emit the ingredient that is to be deleted from the list of selected ingredients.
    @Output() handleDeleteIngredient: EventEmitter<Ingredient> =
        new EventEmitter<Ingredient>()

    size: PizzaSize = PizzaSize.MEDIUM
    activeOrder: Pizza[] = []
    subscription: Subscription = new Subscription()

    constructor(
        private pizzaService: PizzaService,
        private matStepper: MatStepper
    ) {
        // Lifecycle method 1. This will only be called once when the CLASS is first initialized.
        console.log('CONSTRUCTOR')
    }

    onDeleteIngredient(ingredient: Ingredient) {
        // Emit the ingredient that is to be deleted from the list of selected ingredients.
        this.handleDeleteIngredient.emit(ingredient)
    }

    onSizeChange(event: any) {
        this.size = event.value
    }

    savePizza() {
        this.pizzaService.updateActiveOrder([
            ...this.activeOrder,
            {
                id: Date.now(),
                size: this.size,
                ingredients: this.selectedIngredients,
                name: 'Pizza',
                image: '',
                price: calculatePizzaPrice(this.size, this.selectedIngredients),
            },
        ])
        setTimeout(() => {
            this.matStepper.next()
        })
    }

    savePizzaAndMakeAnother() {
        this.pizzaService.updateActiveOrder([
            ...this.activeOrder,
            {
                id: Date.now(),
                size: this.size,
                ingredients: this.selectedIngredients,
                name: 'Pizza',
                image: '',
                price: calculatePizzaPrice(this.size, this.selectedIngredients),
            },
        ])

        this.selectedIngredients.forEach((i) =>
            this.handleDeleteIngredient.emit(i)
        )
    }

    onReset() {
        this.selectedIngredients.forEach((i) =>
            this.handleDeleteIngredient.emit(i)
        )
    }

    ngOnInit() {
        this.subscription = this.pizzaService.activeOrder$.subscribe(
            (order: Pizza[]) => {
                this.activeOrder = order
            }
        )
    }

    ngOnChanges() {
        console.log('ON CHANGES', this.selectedIngredients)
    }

    ngAfterViewInit() {
        console.log('NG AFTER VIEW INIT')
    }

    ngOnDestroy() {
        console.log('NG ON DESTROY')
        this.subscription.unsubscribe()
    }
}
