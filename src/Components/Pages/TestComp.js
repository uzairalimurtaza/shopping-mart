import { useEffect ,useState} from "react"
import axios from "axios"
function TestComp(){
    const [srcDoc,setsrcDoc] = useState("")
    function getDataFromStream() {
        new Promise(()=>{
            return axios({
                url: `http://54.90.50.223/api/mainapi/Documents/GetHTML`,
                method: 'GET',
                onDownloadProgress: progressEvent => {
                   const dataChunk = progressEvent.currentTarget.response;

                   var iframeDocument = window.frames['myFrame'].document;
                   iframeDocument.open();
                   iframeDocument.write(dataChunk);
                   iframeDocument.close();
                   

                //    setsrcDoc(message)
                }
        
        
            }).then(({ data }) => Promise.resolve(data));
        })    
    
    }
    useEffect(()=>{
        getDataFromStream()
    },[])
return <iframe srcDoc={srcDoc} name="myFrame" style={{height:"100vh",width:"100vw"}}>
   </iframe>
}
export default TestComp