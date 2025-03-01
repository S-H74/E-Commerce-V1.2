import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {path:"shipping-address/:cart_Id",renderMode:RenderMode.Server},
  {path:"product-details/:id",renderMode:RenderMode.Server},
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
