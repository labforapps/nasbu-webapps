import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent implements OnInit {

  imagenSubir!: File;
  imgTemp!: any;

  constructor() { }

  ngOnInit(): void {
  }

  changeImage(event: any) {
    const file = event.target.files[0];

    this.imagenSubir = file;

    if (!file) return (this.imgTemp = null);

    const reader = new FileReader();
    const url64 = reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    };

    return this.imgTemp;
  }

  removeImage() {
    this.imgTemp = null;
  }

}
