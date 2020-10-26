import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { routing, appRoutingProviders } from './app.routing';
import { MomentModule } from 'angular2-moment';


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
import { ChatComponent } from './components/chat/chat.component';
import { UploadPublicationComponent } from './components/upload-publication/upload-publication.component';
import { SearchComponent } from './components/search/search.component';


/** Servicios */
import { ChatService } from './services/chat.service';

/** Angular Material */
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SearchPipe } from './pipes/search.pipe';

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
    ChatComponent,
    UploadPublicationComponent,
    SearchComponent,
    SearchPipe
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
    ReactiveFormsModule
  ],
  providers: [
    appRoutingProviders,
    ChatService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
