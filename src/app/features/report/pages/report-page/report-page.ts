import { Component } from '@angular/core';
import {SideBarComponent} from '../../../../shared/components/side-bar/side-bar.component';
import {HeaderBarComponent} from '../../../../shared/components/header-bar/header-bar.component/header-bar.component';

@Component({
  selector: 'app-report-page',
  imports: [
    SideBarComponent,
    HeaderBarComponent
  ],
  templateUrl: './report-page.html',
  styleUrl: './report-page.css'
})
export class ReportPage {

}
