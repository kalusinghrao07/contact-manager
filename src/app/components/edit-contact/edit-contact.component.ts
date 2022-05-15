import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { IContact } from 'src/app/models/IContact';
import { IGroup } from 'src/app/models/IGroup';
import { ContactService } from 'src/app/services/contact.service';

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css']
})
export class EditContactComponent implements OnInit {
  public loading: boolean = false;
  public contactId: string | null = null;
  public contact: IContact = {} as IContact;
  public errorMessage: string | null = null;
  public groups: IGroup[] = [] as IGroup[];

  constructor(private activatedRoute: ActivatedRoute,
              private contactService: ContactService,
              private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe({next: (param: ParamMap) => {
      this.contactId = param.get('contactId');
    }});

    if (this.contactId){
      this.loading = true;
      this.contactService.getContact(this.contactId).subscribe({next: (data: IContact) => {
        this.contact = data;
        this.loading = false;
        this.contactService.getAllGroups().subscribe({next: (data:IGroup[]) => {
          this.groups = data;
        }});
      }, error:(error) => {
        this.errorMessage = error;
        this.loading = false;
      }});
    }
  }

  public updateContact(){
   if(this.contactId){
    this.contactService.updateContact(this.contact, this.contactId).subscribe({next: (data:IContact) => {
      this.router.navigate(['/']).then();
    }, error:(error) => {
      this.errorMessage = error;
      this.router.navigate([`/contact/edit/${this.contactId}`]).then();
    }});
   }
  }

}
