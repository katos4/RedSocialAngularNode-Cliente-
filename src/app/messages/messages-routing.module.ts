import  { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


//componentes
import { MainComponent } from './main/main.component';
import { ReceivedComponent } from './received/received.component';
import { AddComponent } from './add/add.component';
import { SendedComponent } from './sended/sended.component';
import { ViewMessageComponent } from './view-message/view-message.component';
import { UserGuard } from '../services/user.guard';


const messagesRoutes: Routes = [
    {
        path: 'mensajes',
        component: MainComponent,
        children: [
            {path: '', redirectTo: 'recibidos', pathMatch: 'full'},
            {path: 'enviar', component: AddComponent, canActivate:[UserGuard]},
            {path: 'recibidos', component: ReceivedComponent, canActivate:[UserGuard]},
            {path: 'recibidos/:page', component: ReceivedComponent, canActivate:[UserGuard]},
            {path: 'enviados', component: SendedComponent, canActivate:[UserGuard]},
            {path: 'enviados/:page', component: SendedComponent, canActivate:[UserGuard]},
            {path: 'ver-mensaje/:success?', component: ViewMessageComponent, canActivate:[UserGuard]},
            {path: 'ver-mensaje/:id/:back', component: ViewMessageComponent, canActivate:[UserGuard]}
            
          
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(messagesRoutes)
    ],
    exports: [
        RouterModule
    ]
})

export class MessagesRoutingModule {}