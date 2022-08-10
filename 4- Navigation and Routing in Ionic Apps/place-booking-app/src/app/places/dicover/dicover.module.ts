import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DicoverPageRoutingModule } from './dicover-routing.module';

import { DicoverPage } from './dicover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DicoverPageRoutingModule
  ],
  declarations: [DicoverPage]
})
export class DicoverPageModule {}
