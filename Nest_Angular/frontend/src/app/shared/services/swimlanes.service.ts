import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IBoard, ICreateSwimlane, ISwimlane } from '../models/board.model';
import { Observable } from 'rxjs';
import { ReordereSwimlaneDto } from './board.service';

@Injectable({
  providedIn: 'root'
})
export class SwimlanesService {
  http = inject(HttpClient);

  createSwimlane(createSwimlane: ICreateSwimlane): Observable<ISwimlane> {
    return this.http.post<ISwimlane>('/api/swimlane', createSwimlane);
  }
  updateSwimlaneOrder(reorder: ReordereSwimlaneDto): Observable<void> {
    return this.http.put<void>('/api/swimlane/update-order', reorder);
  }
  updateBoard(id: number, createBoard: ICreateSwimlane): Observable<IBoard> {
    return this.http.patch<IBoard>(`/api/board/${id}`, createBoard);
  }
  deleteBoard(boardId: number): Observable<void> {
    return this.http.delete<void>(`/api/swimlane/${boardId}`);
  }
  getBoardById(id: number): Observable<IBoard> {
    return this.http.get<IBoard>(`/api/swimlane/${id}`);
  }
  getBoards(): Observable<IBoard[]> {
    return this.http.get<IBoard[]>('/api/swimlane');
  }
}