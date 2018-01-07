import { Component, Inject, OnInit} from '@angular/core';
import { LoanTerm } from '../loan-term.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-loan-term',
  templateUrl: './loan-term.component.html',
  styleUrls: ['./loan-term.component.css']
})
export class LoanTermComponent implements OnInit {
  loanTermForm: FormGroup;

  /**
   * Our custom validator at form group level for loan term
   *
   */
  loanLadderValidator(fg: FormGroup) {
    return fg.get('maxAmt').value < fg.get('minAmt')
      ? { invalidRange: true} : null;
  }

  constructor(public dialogRef: MatDialogRef<LoanTermComponent>,
              @Inject(MAT_DIALOG_DATA) public data: LoanTerm,
              private fb: FormBuilder) {

    this.loanTermForm = fb.group({
      'interestRate': ['', [Validators.required, Validators.min(1)]],
      'tenure': ['', [Validators.required, Validators.min(1)]],
      'minAmt': ['', [Validators.required, Validators.min(1)]],
      'firstLoanLimit': ['', [Validators.required, Validators.min(1)]],
      'maxAmt': ['', [Validators.required, Validators.min(1)]]
    }, {
      validator: (fg: FormGroup) => {
        return this.loanLadderValidator(fg);
      }
    });

  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(lt: LoanTerm): void {
    console.log('onSubmit', lt);
    this.dialogRef.close(lt);
  }

}
