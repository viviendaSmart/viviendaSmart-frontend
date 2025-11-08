import { Component } from '@angular/core';
import {HeaderBarComponent} from '../../../../shared/components/header-bar/header-bar.component/header-bar.component';
import {SideBarComponent} from '../../../../shared/components/side-bar/side-bar.component';

@Component({
  selector: 'app-client-page',
  imports: [
    HeaderBarComponent,
    SideBarComponent
  ],
  templateUrl: './client-page.html',
  styleUrl: './client-page.css'
})
export class ClientPage {

}
