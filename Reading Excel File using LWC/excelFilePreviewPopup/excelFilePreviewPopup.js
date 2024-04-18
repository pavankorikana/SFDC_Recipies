import { api } from 'lwc';
import LightningModal from 'lightning/modal';
import { loadScript } from 'lightning/platformResourceLoader';
import getExcelFile from '@salesforce/apex/excelFileReaderController.getExcelFile';
import sheetJs from '@salesforce/resourceUrl/sheetJs';  //third-party Js file that helps in reading data from excel file
export default class ExcelFilePreviewPopup extends LightningModal {
    @api fileId;    //to store excel file Id
    fileData;   //Parsed excel file data to display in lightning-datatable
    columnList = [];    //to store column properties
    connectedCallback() {
        this.showPreview();
    }
    isLoading = true;

    async showPreview(){
        try{
            const sheetScript = await loadScript(this, sheetJs);    //loading third-party js file
            let file = await getExcelFile({contentDocId : this.fileId}); //calling excelFileReaderController.getExcelFile() method to fetch excel file data
            if(file != null){//Using third-party js files functionalities to read data from excel and parse as required
                let wBook = XLSX.read(file, {type : 'base64', WTF : false});
                var col1= XLSX.utils.sheet_to_json(wBook.Sheets[wBook.SheetNames[0]], { header : 1, blankrows : false, defal : ''});
                var data = JSON.stringify(col1);
                var dataStr = data.replace("/", "");
                var dataJson = JSON.parse(dataStr);
                let fileData = [];
                if(dataJson.length > 1){    //construting column JSON to display column names in datatable
                    this.columnList = [
                        { label : dataJson[0][0], fieldName : "column1"},
                        { label : dataJson[0][1], fieldName : "column2"},
                        {label : dataJson[0][2], fieldName : "column3"}
                    ]
                    for(let i=1; i < dataJson.length; i++){ //constructing JSON to display data in datatable
                        fileData.push({
                            column1 : dataJson[i][0],
                            column2 : dataJson[i][1],
                            column3 : dataJson[i][2]
                        })
                    }
                    this.fileData = fileData;
                    this.isLoading = false;
                }
            }
        }
        catch(error){
            console.log('error occured--->'+error);
        }
    }
}