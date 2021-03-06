import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { routing, appRoutingProviders } from './app.routing';
import { MomentModule } from 'angular2-moment';

//custom module
import { MessagesModule } from './messages/messages.module';


/** Componentes */
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UsersComponent } from './components/users/users.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PublicationsComponent } from './components/publications/publications.component';
import { FollowingComponent } from './components/following/following.component';
import { FollowedComponent } from './components/followed/followed.component';
import { UploadPublicationComponent } from './components/upload-publication/upload-publication.component';
import { SearchComponent } from './components/search/search.component';
import { InfoCovidComponent } from './components/info-covid/info-covid.component';

/** Servicios */
import { MessageService } from './services/message.service';
import { UserService } from './services/user.service';
import { UserGuard } from './services/user.guard';


/** Angular Material */
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SearchPipe } from './pipes/search.pipe';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

/**Componentes web de angular material */
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';

import {MatNativeDateModule} from '@angular/material/core';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {MatSelectModule} from '@angular/material/select';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatIconModule} from '@angular/material/icon';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    UserEditComponent,
    UsersComponent,
    SidebarComponent,
    TimelineComponent,
    ProfileComponent,
    PublicationsComponent,
    FollowingComponent,
    FollowedComponent,
    UploadPublicationComponent,
    SearchComponent,
    SearchPipe,
    InfoCovidComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    routing,
    HttpClientModule,
    MomentModule,
    NoopAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatIconModule,
    ReactiveFormsModule,
    MessagesModule,
    BrowserAnimationsModule,
    MatMomentDateModule,
    MatPasswordStrengthModule.forRoot()
  ],
  providers: [
    appRoutingProviders,
    MessageService,
    UserService,
    UserGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
