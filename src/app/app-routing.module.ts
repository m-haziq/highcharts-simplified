import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OutputGraphComponent} from './output-graph/output-graph.component';

const routes: Routes = [
  { path: 'output-graph', component: OutputGraphComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
