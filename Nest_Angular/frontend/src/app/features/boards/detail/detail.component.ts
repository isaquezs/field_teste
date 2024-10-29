import { Component, inject, OnInit } from '@angular/core';
import { BoardService } from '../../../shared/services/board.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SwimlanesService } from '../../../shared/services/swimlanes.service';
import { Subject, switchMap } from 'rxjs';
import { ISwimlane } from '../../../shared/models/board.model';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [MatButtonModule, RouterModule, DragDropModule, ReactiveFormsModule, MatInputModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {
  private readonly boardService = inject(BoardService);
  private readonly swimlaneService = inject(SwimlanesService);
  private readonly activatedRoute = inject(ActivatedRoute);
  refetch$ = new Subject<void>();
  board = toSignal(
    this.refetch$
    .asObservable()
    .pipe(
      switchMap(() => 
        this.boardService.getBoardById(
          this.activatedRoute.snapshot.params['id']
        )))
  );

  private readonly fb = inject(NonNullableFormBuilder);
  swimlaneForm = this.fb.group({
    nome: this.fb.control('', Validators.required),
  });

  ngOnInit() {
    this.refetch$.next();
  }

  deleteSwimlane(swimlane: ISwimlane){
    this.swimlaneService.deleteSwimlane(swimlane.id).subscribe(() => {
      this.refetch$.next();
    });
  }

  addSwimlane(){
    if (this.swimlaneForm.invalid) {
      return;
    };
    const _board = this.board();
    if (!_board) return;

    this.swimlaneService
    .createSwimlane({
      nome: this.swimlaneForm.value.nome as string,
      boardId: _board.id,
      ordem: _board.swimlanes?.length || 0
    }).subscribe(() => {
      this.swimlaneForm.reset();
      this.refetch$.next();
    });
  }
}
