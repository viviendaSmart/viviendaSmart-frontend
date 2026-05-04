import {Component, OnInit} from '@angular/core';
import {SideBarComponent} from '../../../../shared/components/side-bar/side-bar.component';
import {HeaderBarComponent} from "../../../../shared/components/header-bar/header-bar.component/header-bar.component";
import {AuthService} from '../../../../shared/services/authentication.service';

@Component({
  selector: 'app-home-page',
  imports: [
    SideBarComponent,
    HeaderBarComponent
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage implements OnInit {
  constructor(private authService: AuthService) {
  }
ngOnInit() {
  this.loadFullName()
}
loadFullName() {
  const raw = this.authService.getUser()
  const fullname = raw.firstName + ' ' + raw.lastName;
  return fullname;
}
}
