import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css'],
  providers: [UserService]
})
export class UserInfoComponent implements OnInit {
public identity;

  constructor(
    private _userService: UserService
  ) {
    this.identity = this._userService.getIdentity();

   }

  ngOnInit(): void {

  }

}
