import { MatSnackBarConfig } from '@angular/material/snack-bar'

export const environment: {
    production: boolean
    apiUrl: string
    snackBarConfig: MatSnackBarConfig
} = {
    production: false,
    apiUrl: 'https://localhost:7098/api',
    snackBarConfig: {
        verticalPosition: 'top',
        horizontalPosition: 'end',
        duration: 3000,
    },
}