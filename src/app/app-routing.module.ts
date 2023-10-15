import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { HomeComponent } from './components/home/home.component'
import { authGuard } from './guards/auth.guard'

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    {
        path: 'pizza-maker',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./components/pizza-maker/pizza-maker.component').then(
                (module) => module.PizzaMakerComponent
            ),
    },
    {
        path: 'previous-orders',
        canActivate: [authGuard],
        loadComponent: () => import(`./components/previous-order/previous-order.component`)
            .then(module => module.PreviousOrdersComponent)
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./components/login/login.component').then(
                (module) => module.LoginComponent
            ),
    },
    {
        path: 'register',
        loadComponent: () =>
            import('./components/register/register.component').then(
                (module) => module.RegisterComponent
            ),
    },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)], 
    exports: [RouterModule],
})
export class AppRoutingModule {}

