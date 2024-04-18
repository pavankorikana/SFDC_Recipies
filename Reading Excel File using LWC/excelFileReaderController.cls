public class excelFileReaderController {

    public class fileWrapper{
        @AuraEnabled
        public String fileName;
        @AuraEnabled
        public String fileId;
    }

    @AuraEnabled(cacheable=true)
    public static List<fileWrapper> fetchExcelFileNames(String recId){
        List<ContentDocumentLink> fileList = [Select Id, ContentDocument.Title, ContentDocumentId From ContentDocumentLink Where LinkedEntityId =: recId and ContentDocument.FileExtension = 'xlsx'];
        List<fileWrapper> fileWrapperList = new List<fileWrapper>();
        for (ContentDocumentLink cd: fileList){
            fileWrapper fw = new fileWrapper();
            fw.fileName = cd.ContentDocument.Title;
            fw.fileId = cd.ContentDocument.Id;
            fileWrapperList.add(fw);
        }
        return fileWrapperList;
    }

    @AuraEnabled(cacheable=true)
    public static String getExcelFile(String contentDocId){
        return EncodingUtil.base64Encode([Select Id, VersionData From ContentVersion Where IsLatest = true AND ContentDocumentId =: contentDocId Limit 1].VersionData);
    }
}