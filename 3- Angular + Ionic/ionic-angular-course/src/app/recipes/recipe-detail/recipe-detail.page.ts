import {Component, OnInit} from '@angular/core';
import {RecipesService} from "../recipes.service";
import {ActivatedRoute, Router} from "@angular/router";
import {IRecipe} from "../recipe.model";
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.page.html',
  styleUrls: ['./recipe-detail.page.scss'],
})
export class RecipeDetailPage implements OnInit {
  public recipe: IRecipe | null = null;

  constructor(
    private _recipesService: RecipesService,
    private _alertController: AlertController,
    private _activatedRoute: ActivatedRoute,
    private _router: Router) {
  }

  ngOnInit() {
    this.getRecipeDetails();
  }

  getRecipeDetails() {
    this._activatedRoute.paramMap.subscribe(parameter => {
      if (!parameter.has('recipeId')) {
        return;
      }
      const recipeId = parameter.get('recipeId');
      this.recipe = this._recipesService.getRecipe(recipeId);
    });
  }

  deleteRecipe(id: string) {
    this._alertController.create({
      header: "Delete",
      subHeader: 'Are you sure?',
      message: 'Do you really want to delete this recipe.',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
      },
        {
          text: 'Delete',
          handler:()=>{
            this._recipesService.deleteRecipe(this.recipe.id);
            this._router.navigate(['/recipes']);
          }
        }
      ]
    }).then(alertElement =>
      alertElement.present()
    );
  }
}
