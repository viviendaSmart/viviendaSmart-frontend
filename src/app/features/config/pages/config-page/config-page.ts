import {Component, Input, OnInit} from '@angular/core';
import {SideBarComponent} from "../../../../shared/components/side-bar/side-bar.component";
import {HeaderBarComponent} from '../../../../shared/components/header-bar/header-bar.component/header-bar.component';
import {AuthService} from '../../../../shared/services/authentication.service';
import {ConfigService} from '../../services/config.service';
import {Config} from '../../models/config.entity';
import {ConfigFormModal} from '../../components/config-form-modal/config-form-modal';
import {Property} from '../../../property/models/property.entity';
import {ClientFormModal} from '../../../client/components/client-form-modal/client-form-modal';
import {MatSnackBar} from '@angular/material/snack-bar';
@Component({
  selector: 'app-config-page',
  imports: [
    SideBarComponent,
    HeaderBarComponent,
    ConfigFormModal,
    ClientFormModal
  ],
  templateUrl: './config-page.html',
  styleUrl: './config-page.css'
})
export class ConfigPage implements OnInit {
  selectedConfig: Config| null = null;
  constructor(private authService: AuthService,
              private configService: ConfigService,
              private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadConfig();
  }
  loadConfig() {
    const user = this.authService.getUser();
    const userId = user.id;
    this.configService.getByUserId(userId).subscribe({
      next: (config: Config) => {
        this.selectedConfig = config;
        //console.log('Config cargada:', this.selectedConfig);
      },
      error: (err) => {
        console.error('Error al obtener la config:', err);
      }
    })
  }
  onFormSubmittedOrEdited(formValue: any) {
    const user = this.authService.getUser();
    const userId = user.id;

    if (!this.selectedConfig || !this.selectedConfig.id) {
      const newConfig: Config = {
        ...formValue,
        userId: userId
      };
      this.configService.postConfig(newConfig).subscribe({
        next: (created) => {
          //console.log('✅ Config creada:', created);
          this.selectedConfig = created;   // guarda la nueva config en memoria
          this._snackBar.open('Configuración guardada correctamente', '', { duration: 3000 });
          this.loadConfig();       // opcional: recargar por si el backend modifica algo
        },
        error: (err) => {
          console.error('Error al crear configuración', err);
          this._snackBar.open('Error al guardar la configuración', '', { duration: 3000 });
        }
      });

    } else {
      const updatedConfig: Config = {
        ...this.selectedConfig,   // id, userId, etc.
        ...formValue,
        userId: userId    // por si acaso
      };

      this.configService.putConfig(updatedConfig).subscribe({
        next: (updated) => {
          //console.log('✅ Config actualizada:', updated);
          this.selectedConfig = updated;
          this._snackBar.open('Configuración actualizada correctamente', '', { duration: 3000 });
          this.loadConfig();       // opcional
        },
        error: (err) => {
          console.error('Error al actualizar configuración', err);
          this._snackBar.open('Error al actualizar la configuración', '', { duration: 3000 });
        }
      });
    }

  }
}
