import { Component } from '@angular/core';
import {SideBarComponent} from '../../../../shared/components/side-bar/side-bar.component'
import {HeaderBarComponent} from '../../../../shared/components/header-bar/header-bar.component/header-bar.component';
import {CreditData} from '../../components/credit-data/credit-data';
@Component({
  selector: 'app-simulator-page',
  imports: [
    SideBarComponent,
    HeaderBarComponent,
    CreditData
  ],
  templateUrl: './simulator-page.html',
  styleUrl: './simulator-page.css'
})
export class SimulatorPage {
}
