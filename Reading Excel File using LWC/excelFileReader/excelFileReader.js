import { LightningElement, api } from 'lwc';
import fileNameFetcher from '@salesforce/apex/excelFileReaderController.fetchExcelFileNames';
import previewModal from 'c/excelFilePreviewPopup';
export default class ExcelFileReader extends LightningElement {
    @api recordId;
    fileName;
    showPreview = false;
    fileNames = [];

    connectedCallback() {
        this.getFileNames();
    }

    getFileNames(){
        fileNameFetcher({recId : this.recordId})
        .then((data) => {
            let fileNames = [];
            data.forEach(currentItem => {
                fileNames.push({
                    label : currentItem.fileName,
                    value : currentItem.fileId
                });
            });
            this.fileNames = fileNames;
        });
    }

    onChange(event){
        if(event.detail.value != undefined || event.detail.target != ''){
            this.fileName = event.detail.value;
            this.showPreview = true;
        }
    }

    handlePreview(){  //opens another LWC as a Modal/Popup
        previewModal.open({
            size: 'large',
            fileId : this.fileName
        });
    }
}