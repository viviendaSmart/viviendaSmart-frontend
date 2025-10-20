import { Component } from '@angular/core';
import {SideBarComponent} from "../../../../shared/components/side-bar/side-bar.component";
import {HeaderBarComponent} from '../../../../shared/components/header-bar/header-bar.component/header-bar.component';

@Component({
  selector: 'app-user-page',
  imports: [
    SideBarComponent,
    HeaderBarComponent
  ],
  templateUrl: './user-page.html',
  styleUrl: './user-page.css'
})
export class UserPage {

}
