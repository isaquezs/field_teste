import { Component, inject } from '@angular/core';
import { BoardService } from '../../../shared/services/board.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddBoardComponent } from '../components/add-board/add-board.component';
import { IBoard } from '../../../shared/models/board.model';
import { Subject, switchMap } from 'rxjs';


@Component({
  selector: 'app-list',
  standalone: true,
  imports: [RouterModule, MatCardModule, MatButtonModule, MatDialogModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  private readonly dialog = inject(MatDialog);
  private readonly boardService = inject(BoardService);
  refetch$ = new Subject<void>();
  boards = toSignal(
    this.refetch$.asObservable()
    .pipe(switchMap(() => this.boardService.getBoards()))
  );

  ngOnInit() {
    this.refetch$.next();
  }

  openNewBoardFlow(board?: IBoard) {
    this.dialog
    .open(AddBoardComponent, {
      width: '400px',
      data: {
        board,
      },
    }).afterClosed()
    .subscribe((board: IBoard) => {
      board && this.refetch$.next();
    });
  }

  deleteBoard(board: IBoard) {
    this.boardService.deleteBoard(board.id)
    .subscribe(() => {
      this.refetch$.next();
    });
  }
}

