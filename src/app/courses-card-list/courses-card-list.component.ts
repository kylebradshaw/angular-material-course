import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {Course} from "../model/course";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { openEditCourseDialog } from '../course-dialog/course-dialog.component';
import { filter } from 'rxjs/operators';
@Component({
    selector: 'courses-card-list',
    templateUrl: './courses-card-list.component.html',
    styleUrls: ['./courses-card-list.component.scss']
})
export class CoursesCardListComponent implements OnInit {

    @Input()
    courses: Course[];
    cols = 3;
    rowHeight = '500px';
    handsetPortrait = false;

    constructor(
      private dialog: MatDialog,
      private responsive: BreakpointObserver,
    ) {
    }

    ngOnInit() {
      // example of how the service works
      // this.responsive.observe(['(max-width: 959px)']).subscribe(result => console.log(result));

      // usually used like this
      this.responsive.observe([
        Breakpoints.TabletPortrait,
        Breakpoints.TabletLandscape,
        Breakpoints.HandsetPortrait,
        Breakpoints.HandsetLandscape,
      ]).subscribe(result => {
        console.log(result)
        this.cols = 3;
        this.rowHeight = '500px';
        this.handsetPortrait = false;
        // we can change the display appropriately
        const breakpoints = result.breakpoints;
        if (breakpoints[Breakpoints.TabletPortrait]) {
          this.cols = 1;
        } else if (breakpoints[Breakpoints.HandsetPortrait]) {
           this.handsetPortrait = true;
           this.cols = 1;
           this.rowHeight = '430px';
        } else if (breakpoints[Breakpoints.HandsetLandscape]) {
          this.cols = 1;
        } else if (breakpoints[Breakpoints.TabletLandscape] || breakpoints[Breakpoints.WebLandscape]) {
          this.cols = 2;
        }
      });
    }

    editCourse(course:Course) {
      openEditCourseDialog(this.dialog, course) // returns afterClose observable
        .pipe(
          filter(val => !!val), // if val is null, don't do anything
        )
        .subscribe(val => console.log(`new course value`, val));

    }

}









