import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs'
import { Ingredient } from '../types/enums/ingredient.enum'
import { Pizza } from '../types/interfaces/pizza.interfaces'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { convertIngredientsFeToBe } from '../helpers/convertIngredientsFEtoBe.helper'
import { OrderBE, PizzaBE } from '../types/interfaces/order.interface'
import { environment } from 'src/environments/environment'
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar'

@Injectable({
    providedIn: 'root',
})
export class PizzaService {
    private activeOrder: BehaviorSubject<Pizza[]> = new BehaviorSubject<
        Pizza[]
    >([])

    activeOrder$: Observable<Pizza[]> = this.activeOrder.asObservable()

    updateActiveOrder(order: Pizza[]): void {
        this.activeOrder.next(order)
    }

    private selectedIngredients: BehaviorSubject<Ingredient[]> =
        new BehaviorSubject<Ingredient[]>([])

    selectedIngredients$: Observable<Ingredient[]> =
        this.selectedIngredients.asObservable()

    updateSelectedIngredients(ingredients: Ingredient[]): void {
        this.selectedIngredients.next(ingredients)
    }

    constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar) {}

    updatePizzaTitle(id: number, name: string) {
        const order = this.activeOrder.getValue()
        const index = order.findIndex((p) => p.id === id)
        order[index].name = name
        this.updateActiveOrder(order)
    }

    submitOrder(addressTo: string): Observable<void> {
        const pizzas = this.activeOrder.getValue()

        const mappedPizzas = pizzas.map((pizza) => ({
            name: pizza.name,
            price: Math.round(pizza.price),
            ingredients: convertIngredientsFeToBe(pizza.ingredients)
        })) satisfies PizzaBE[]

        const order = {
            pizzas: mappedPizzas,
            addressTo,
            orderPrice: Math.round(
                pizzas.reduce((acc, pizza) => acc + pizza.price, 0)
            )
        } satisfies OrderBE

        return this.http.post<void>(`${environment.apiUrl}/order`, order).pipe(
            tap(() => {
                    this.snackBar.open(
                        'You have successfully add order!',
                        'Close',
                        environment.snackBarConfig
                    )
                    this.router.navigate(['/'])
                }),
            catchError((error) => {
                if (error) {
                    this.snackBar.open(
                        error?.error?.errors?.[0] || 'Error while making an order!',
                        'Close',
                        environment.snackBarConfig
                    )
                }
                return of()
            })
        )
    }

    deletePizzaFromOrder(index: number) {
        const updatedOrder = this.activeOrder
            .getValue()
            .filter((_, i) => i !== index)

        this.updateActiveOrder(updatedOrder)
    }

    getSavedPizzas(): Observable<Pizza[]> {
        return this.http.get<Pizza[]>(`${environment.apiUrl}/Pizza`)
    }

    deletePizza(id: number): Observable<void> {
        return this.http.delete<void>(`${environment.apiUrl}/Pizza/${id}`).pipe(
            tap(() => {
                this.snackBar.open(
                    'You have successfully deleted the pizza!',
                    'Close',
                    environment.snackBarConfig
                )
            }),
            catchError((error) => {
                if (error) {
                    this.snackBar.open(
                        error?.error?.errors?.[0] || 'Error while deleting the pizza!',
                        'Close',
                        environment.snackBarConfig
                    )
                }
                return of()
            })
        )
    }

    defaultPizzas: Pizza[] = [
        {
            id: 1,
            name: 'Margherita',
            price: 5,
            image: '/assets/margherita.png',
            ingredients: [Ingredient.TOMATO_SAUCE, Ingredient.MOZZARELLA],
        },
        {
            id: 2,
            name: 'Neapolitan',
            price: 5,
            image: '/assets/neapolitan.png',
            ingredients: [
                Ingredient.TOMATO_SAUCE,
                Ingredient.MOZZARELLA,
                Ingredient.HAM,
            ],
        },
        {
            id: 3,
            name: 'Quatro Formagi',
            price: 6,
            image: '/assets/quatro-formagi.png',
            ingredients: [
                Ingredient.PARMESAN,
                Ingredient.MOZZARELLA,
                Ingredient.BLUE_CHEESE,
                Ingredient.GORGONZOLA,
            ],
        },
        {
            id: 4,
            name: 'Bacon',
            price: 6,
            image: '/assets/bacon.png',
            ingredients: [
                Ingredient.BACON,
                Ingredient.TOMATO_SAUCE,
                Ingredient.MOZZARELLA,
            ],
        },
        {
            id: 5,
            name: 'Bianca',
            price: 6,
            image: '/assets/bianca.png',
            ingredients: [Ingredient.SOUR_CREAM],
        },
        {
            id: 6,
            name: 'Capricciosa',
            price: 6,
            image: '/assets/capri.png',
            ingredients: [
                Ingredient.HAM,
                Ingredient.TOMATO_SAUCE,
                Ingredient.MUSHROOMS,
                Ingredient.MOZZARELLA,
            ],
        },
        {
            id: 7,
            name: 'Mexicana',
            price: 6,
            image: '/assets/mexicana.png',
            ingredients: [
                Ingredient.TOMATO_SAUCE,
                Ingredient.GORGONZOLA,
                Ingredient.OLIVES,
                Ingredient.PEPPERONI,
                Ingredient.CHILLI_PEPPER,
            ],
        },
        {
            id: 8,
            name: 'Pepperoni',
            price: 6,
            image: '/assets/pepperoni.png',
            ingredients: [
                Ingredient.TOMATO_SAUCE,
                Ingredient.GORGONZOLA,
                Ingredient.PEPPERONI,
            ],
        },
        {
            id: 9,
            name: 'Tuna',
            price: 6,
            image: '/assets/tuna.png',
            ingredients: [
                Ingredient.TOMATO_SAUCE,
                Ingredient.TUNA,
                Ingredient.MOZZARELLA,
                Ingredient.ONION,
            ],
        },
        {
            id: 10,
            name: 'Vegetariana',
            price: 6,
            image: '/assets/vegetariana.png',
            ingredients: [
                Ingredient.TOMATO_SAUCE,
                Ingredient.MOZZARELLA,
                Ingredient.OLIVES,
                Ingredient.MUSHROOMS,
            ],
        },
    ]
}
