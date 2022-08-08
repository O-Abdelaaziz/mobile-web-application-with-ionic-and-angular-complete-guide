import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: 'recipes',
    children: [
      {
        path: '',
        loadChildren: () => import('./recipes/recipes.module').then(r => r.RecipesPageModule)
      },
      {
        path: ':recipeId ',
        loadChildren: () => import('./recipes/recipe-detail/recipe-detail.module').then(rd => rd.RecipeDetailPageModule)
      },
    ]
  },

  {
    path: '',
    redirectTo: 'recipes',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
