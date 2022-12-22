import { NgModule } from "@angular/core";
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
   //import array angular automatic added so no need to declare import array - for optimization
    exports:[
        MatToolbarModule,
        MatCardModule,
        MatButtonModule,
        MatExpansionModule,
        MatInputModule,
        MatFormFieldModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
    ]
})
export class AngularMaterialModule {
   
}