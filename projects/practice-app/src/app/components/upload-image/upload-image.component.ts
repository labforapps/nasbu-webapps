import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent implements OnInit {

  @Output() imgUpload:any = new EventEmitter<File>();
  @Input()  imgUrl!:string | null;
  imgTemp!:any;

  constructor() { }

  ngOnInit(): void {
  }

  changeImage(event: any) {
    const file = event.target.files[0];

    if (!file) return (this.imgTemp = null);

    const reader = new FileReader();
    const url64 = reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
      this.imgUpload.emit(file);
    };

    return this.imgTemp;
  }

  removeImage() {
    this.imgTemp = null;
    this.imgUrl = null;
    this.imgUpload.emit(null);
  }

}
