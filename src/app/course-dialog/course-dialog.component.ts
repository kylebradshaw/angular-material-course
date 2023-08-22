import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA,  MatDialog,  MatDialogConfig,  MatDialogRef} from '@angular/material/dialog';
import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import * as moment from 'moment';

@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent implements OnInit {
    description: string;

    // we're prepopulating form with course data
    form = this.fb.group({
      description: [this.course.description, Validators.required],
      category: [this.course.category, Validators.required],
      releasedAt: [new Date(), Validators.required],
      longDescription: [this.course.longDescription, Validators.required],
    });

    constructor(
      private fb: FormBuilder,
      // send course to dialog
      @Inject(MAT_DIALOG_DATA) private course: Course,
      private dialogRef: MatDialogRef<CourseDialogComponent>
    ) {
      this.description = course.description;
    }

    ngOnInit() {

    }

    close() {
      this.dialogRef.close();
    }

    save() {
      this.dialogRef.close(this.form.value); // pass form value to whomever called the dialog
    }

}

export function openEditCourseDialog(dialog: MatDialog, course: Course) {
  const config = new MatDialogConfig();
  config.disableClose = true; // dialog not closed on esc
  config.autoFocus = true; // focus on first input
  config.data = {...course}; // pass data to dialog
  const dialogRef = dialog.open(CourseDialogComponent, config);

  return dialogRef.afterClosed(); // observable that wil get the this.form.value in the observable


}

