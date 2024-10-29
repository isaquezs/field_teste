import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBoard, ICreateBoard } from '../models/board.model';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  http = inject(HttpClient);

  createBoard(createBoard: ICreateBoard): Observable<IBoard> {
    return this.http.post<IBoard>('/api/board', createBoard);    
  }
  
  updateBoard(id: number,createBoard: ICreateBoard): Observable<IBoard> {
    return this.http.patch<IBoard>(`/api/board/${id}`, createBoard);    
  }

  deleteBoard(boardId: number): Observable<void> {
    return this.http.delete<void>(`/api/board/${boardId}`);    
  }

  getBoards(): Observable<IBoard[]> {
    return this.http.get<IBoard[]>('/api/board');
  }

}
