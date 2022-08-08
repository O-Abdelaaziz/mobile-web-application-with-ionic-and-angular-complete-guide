import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecipesPageRoutingModule } from './recipes-routing.module';

import { RecipesPage } from './recipes.page';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RecipesPageRoutingModule,
    FormsModule,
    IonicModule,
    RouterModule
  ],
  declarations: [RecipesPage]
})
export class RecipesPageModule {}
