import { Component, inject, OnInit } from '@angular/core';
import { BoardService } from '../../../shared/services/board.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SwimlanesService } from '../../../shared/services/swimlanes.service';
import { Subject, switchMap } from 'rxjs';
import { ICard, ISwimlane } from '../../../shared/models/board.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddCardComponent } from '../components/add-card/add-card.component';
import { CardService } from '../../../shared/services/card.service';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [MatButtonModule, RouterModule, DragDropModule, ReactiveFormsModule, MatInputModule, MatDialogModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {
  private readonly boardService = inject(BoardService);
  private readonly matDialog = inject(MatDialog);
  private readonly swimlaneService = inject(SwimlanesService);
  private readonly cardService = inject(CardService);
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
  cardForm = this.fb.group({
    nome: this.fb.control('', Validators.required),
  });

  ngOnInit() {
    this.refetch$.next();
  }

  deleteSwimlane(swimlane: ISwimlane) {
    this.swimlaneService.deleteSwimlane(swimlane.id).subscribe(() => {
      this.refetch$.next();
    });
  }

  aoMudarCard($event: CdkDragDrop<any>, swimlane: ISwimlane): void {
    console.log($event, swimlane);
    if ($event.previousContainer === $event.container) {
      moveItemInArray(
        swimlane.cards || [],
        $event.previousIndex,
        $event.currentIndex
      );
    } else {
      transferArrayItem(
        $event.previousContainer.data,
        $event.container.data,
        $event.previousIndex,
        $event.currentIndex
      )
    }

    const _board = this.board();
    if (!_board) return;

    const cards: ICard[] = _board.swimlanes?.reduce(
      (prev: ICard[], current: ISwimlane) => {
        const cards =
          current.cards?.map((c, idx) => ({
            ...c,
            swimlaneId: current.id,
            ordem: idx,
          })) ||
          [];

        return [...prev, ...cards];
      }, []) || [];

    console.log(this.board())
    this.cardService.updateCardOrderAndSwimlanes(_board.id, cards).subscribe(() => {
      this.refetch$.next();
    });
  }

  aoMudarSwimlane($event: CdkDragDrop<any>): void {
    const _board = this.board();
    if (!_board) return;
    moveItemInArray(
      _board.swimlanes || [],
      $event.previousIndex,
      $event.currentIndex
    );

    this.boardService
      .updateSwimlaneOrder({
        boardId: _board.id,
        items:
          _board.swimlanes?.map((swimlane, index) => ({
            id: swimlane.id,
            ordem: index,
          })) || [],
      })
      .subscribe(() => {
        this.refetch$.next();
      });
    console.log(this.board()?.swimlanes)
  }

  adicionarCard(swimlane: ISwimlane, card?: ICard) {
    this.matDialog.open(AddCardComponent, {
      width: '600px',
      data: {
        swimlane: swimlane,
        boardId: swimlane.boardId,
        card,
      }
    }).afterClosed().subscribe((card?: ICard) => {
      card && this.refetch$.next();
    });
  }

  addSwimlane() {
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
