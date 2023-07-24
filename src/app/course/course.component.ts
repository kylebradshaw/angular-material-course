import { Lesson } from './../model/lesson';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Course } from "../model/course";
import { CoursesService } from "../services/courses.service";
import { debounceTime, distinctUntilChanged, startWith, tap, delay, catchError, finalize } from 'rxjs/operators';
import { merge, fromEvent, throwError } from "rxjs";
import { SelectionModel } from '@angular/cdk/collections';

@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit, AfterViewInit {
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    course: Course;

    lessons: Lesson[];
    // lessons = [
    //    {
    //     id: 120,
    //     'description': 'Introduction to Angular Material',
    //     'duration': '4:17',
    //     'seqNo': 1,
    //     courseId: 11
    //   },
    //   {
    //     id: 121,
    //     'description': 'Navigation and Containers',
    //     'duration': '6:37',
    //     'seqNo': 2,
    //     courseId: 11
    //   },
    //   {
    //     id: 122,
    //     'description': 'Data Tables',
    //     'duration': '8:03',
    //     'seqNo': 3,
    //     courseId: 11
    //   },
    //   {
    //     id: 123,
    //     'description': 'Dialogs and Overlays',
    //     'duration': '11:46',
    //     'seqNo': 4,
    //     courseId: 11
    //   },
    //   {
    //     id: 124,
    //     'description': 'Commonly used Form Controls',
    //     'duration': '7:17',
    //     'seqNo': 5,
    //     courseId: 11
    //   },
    //   {
    //     id: 125,
    //     'description': 'Drag and Drop',
    //     'duration': '8:16',
    //     'seqNo': 6,
    //     courseId: 11
    //   },
    //   {
    //     id: 126,
    //     'description': 'Responsive Design',
    //     'duration': '7:28',
    //     'seqNo': 7,
    //     courseId: 11
    //   },
    //   {
    //     id: 127,
    //     'description': 'Tree Component',
    //     'duration': '11:09',
    //     'seqNo': 8,
    //     courseId: 11
    //   },
    //   {
    //     id: 128,
    //     'description': 'Virtual Scrolling',
    //     'duration': '3:44',
    //     'seqNo': 9,
    //     courseId: 11
    //   },
    //   {
    //     id: 129,
    //     'description': 'Custom Themes',
    //     'duration': '8:55',
    //     'seqNo': 10,
    //     courseId: 11
    //   },
    //   {
    //     id: 130,
    //     'description': 'Changing Theme at Runtime',
    //     'duration': '12:37',
    //     'seqNo': 11,
    //     courseId: 11
    //   }
    // ];

    loading = false;
    displayedColumns = ['select', 'seqNo', 'description', 'duration'];
    selection = new SelectionModel<Lesson>(true, []);
    expandedLesson: Lesson | null;

    constructor(private route: ActivatedRoute,
        private coursesService: CoursesService) {

    }

    ngOnInit() {

        this.course = this.route.snapshot.data["course"];

        this.loadLessonsPage();


    }

    onLessonToggled(lesson: Lesson) {
        this.selection.toggle(lesson);
        console.log(this.selection.selected);
    }

    loadLessonsPage() {
        this.loading = true;
        this.coursesService.findLessons(
            this.course.id,
            this.sort?.direction ?? 'asc', // 'asc',
            this.paginator?.pageIndex ?? 0,
            this.paginator?.pageSize ?? 3,
            this.sort?.active ?? 'seqNo') // sets the initial sort column
            .pipe(
                tap(lessons => this.lessons = lessons),
                catchError(err => {
                    console.log(err);
                    return throwError(err);
                }),
                finalize(() => this.loading = false)
            )
            .subscribe();
    };

    onToggleLesson(lesson: Lesson) {
        if (lesson == this.expandedLesson) {
            this.expandedLesson = null;
        } else {
            this.expandedLesson = lesson;
        }
    }

    ngAfterViewInit() {
        // this.paginator.page.pipe(
        //     tap(() => this.loadLessonsPage())
        // ).subscribe();

        // reset the paginator  when the sort changes
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

        // we want to refresh the lessons when the lessons changesand combine the 2, use the merge observable
        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                tap(() => this.loadLessonsPage())
            ).subscribe();
    }

    isAllSelected() {
        return this.selection.selected?.length == this.lessons?.length;
    }

    toggleAll() {
        if (this.isAllSelected()) {
            this.selection.clear();
        } else {
            this.selection.select(...this.lessons);
        }
    }
}
