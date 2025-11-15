import { RouterLink } from '@angular/router';
import { INavBarData } from './Helper'
export const navBarData: INavBarData[] = [
    {
        routerLink: 'hfg',
        icon: 'fa fa-home',
        label: 'Dashboard'
    },
    {

        routerLink: 'medicos',
        icon: 'fas fa-user-md',
        label: 'Medics'
    },
    {
        routerLink: 'enfermeras',
        icon: 'fas fa-user-nurse',
        label: 'Nurses'
    },
    {
        routerLink: 'pacientes',
        icon: 'fa fa-heartbeat',
        label: 'Patiens'
    },
    {
        routerLink: 'citas',
        icon: 'fas fa-calendar-check',
        label: 'medical_appointment'
    },
]