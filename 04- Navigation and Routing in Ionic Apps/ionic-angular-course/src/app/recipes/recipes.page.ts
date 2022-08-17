import {Component, OnInit, OnDestroy} from '@angular/core';
import {IRecipe} from './recipe.model';
import {RecipesService} from './recipes.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss'],
})
export class RecipesPage implements OnInit, OnDestroy {
  public recipes: IRecipe[] = [];

  constructor(private _recipesService: RecipesService) {
  }

  ngOnInit() {
    //Something Occurred Here ?
    //ngOnInit() is not called when got to page detail and go back.
    //Why?
    //because RecipesPage is cached depends on ionic behavior
    //when we use angular normal routing behavior the RecipesPage not destroyed but is cached
    //this.recipes = this._recipesService.getAllRecipes();
    console.log('LOADED RECIPE!');
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
    this.recipes = this._recipesService.getAllRecipes();
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter');
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave');
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave');
  }

  ngOnDestroy(): void {
    console.log('OnDestroy!');
  }
}
