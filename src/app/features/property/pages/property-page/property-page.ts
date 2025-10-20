import { Component } from '@angular/core';
import {SideBarComponent} from '../../../../shared/components/side-bar/side-bar.component';
import {HeaderBarComponent} from '../../../../shared/components/header-bar/header-bar.component/header-bar.component';

@Component({
  selector: 'app-property-page',
  imports: [
    SideBarComponent,
    HeaderBarComponent
  ],
  templateUrl: './property-page.html',
  styleUrl: './property-page.css'
})
export class PropertyPage {

}
