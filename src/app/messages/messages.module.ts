//modulos
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MomentModule } from 'angular2-moment';


//rutas
import { MessagesRoutingModule } from './messages-routing.module';

//componentes
import { MainComponent } from './main/main.component';
import { ReceivedComponent } from './received/received.component';
import { AddComponent } from './add/add.component';
import { SendedComponent } from './sended/sended.component';
import { ViewMessageComponent } from './view-message/view-message.component';

/**Angular material */
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

//servicios
import { UserService } from '../services/user.service';
import { UserGuard } from '../services/user.guard';




@NgModule({
    declarations:[
        MainComponent,
        AddComponent,
        ReceivedComponent,
        SendedComponent,
        ViewMessageComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MessagesRoutingModule,
        MomentModule,
        MatSelectModule,
        MatAutocompleteModule
    ],
    exports: [
        MainComponent,
        AddComponent,
        ReceivedComponent,
        SendedComponent
    ],
    providers: [
        UserService,
        UserGuard
    ]
})

export class MessagesModule{}
