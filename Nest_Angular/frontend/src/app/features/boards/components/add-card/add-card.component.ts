import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { CardService } from '../../../../shared/services/card.service';
import { ICard } from '../../../../shared/models/board.model';

@Component({
  selector: 'app-add-card',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule],
  templateUrl: './add-card.component.html',
  styleUrl: './add-card.component.scss'
})
export class AddCardComponent {
  private readonly dialogRef = inject(MatDialogRef);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly cardService = inject(CardService);
  readonly data = inject(MAT_DIALOG_DATA);
  addCardForm = this.fb.group({
    ordem: this.fb.control(this.data.swimlane.cards.length),
    boardId: this.fb.control(this.data.boardId),
    swimlaneId: this.fb.control(this.data.swimlane.id),
    nome: this.fb.control(this.data.card?.nome, [Validators.required]),
    conteudo: this.fb.control(this.data.card?.conteudo, [Validators.required]),
  });

  criarOuEditarCard() {
    if (this.addCardForm.invalid) {
      return;
    }

    if (this.data.card?.id) {
      this._updateCard();
    }

    else {
      this._createCard();
    }
  }

  private _updateCard() {
    this.cardService
      .updateCard(this.data.card?.id, this.addCardForm.value as Partial<ICard>)
      .subscribe((card: ICard) => {
        this.dialogRef.close(card);
      });
  }

  private _createCard() {
    this.cardService
      .createCard(this.addCardForm.value as Partial<ICard>)
      .subscribe((card: ICard) => {
        this.dialogRef.close(card);
      });
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
