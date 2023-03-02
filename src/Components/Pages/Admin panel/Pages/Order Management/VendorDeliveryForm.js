import { useState,useEffect } from "react";
import Endpoint from "../../../../../Utils/Endpoint";
import BanglaBazarApi from "../../../../Api/BanglaBazarApi";
import { useParams ,useHistory} from "react-router-dom";
import firetoast from "../../../../../Helpers/FireToast";
export function VendorDeliveryForm() {
  const [option, setOption] = useState(1);
  const [records,setRecords] = useState([])
  const {orderNumber} = useParams()
  const history = useHistory()
  const [selectedService,setSelectedService] = useState(null)
const [trackingNumber,setTrackingNumber] = useState(null)
const [vendorNumber,setVendorNumber] = useState(null)
const [serviceName,setServiceName] = useState(null)
  useEffect(()=>{
    getServicesAndInit()
  },[])
  let getServicesAndInit = async () => {
    try {
      var resp = await BanglaBazarApi.get(
        `${Endpoint}/api/courier/get-courier`
      );

      try {
        setRecords(resp["data"].getCourierService);
      } catch (e) {
        console.log(e);
      }
    } catch (e) {
      console.log(e);
    }
  };
  let saveAndUpdate =async()=>{
      if(option === 1){
          try{
              const response = await BanglaBazarApi.post(`${Endpoint}/api/courier/update-order`,{
                OrderNumber :orderNumber,
                CourierID:selectedService,
                TrackingNumber:trackingNumber,
                CourierName:serviceName
              })

              if(response.data.status){
                  firetoast("Order status updated","success",2000,"top-center")
                  setTimeout(()=>{
                      history.push("/panel/order-management")
                  },3000)
              }
              else{
                firetoast(response.data.error||response.data.message,"default-error")
              }
          }
          catch(e){
              console.log(e)
          }
      }
      else{
        try{
            const response = await BanglaBazarApi.post(`${Endpoint}/api/courier/send-contact`,{
              OrderNumber :orderNumber,
              ContactNo:vendorNumber
            })

            if(response.data.status){
                firetoast("Order status updated","success",2000,"top-center")
                setTimeout(()=>{
                    history.push("/panel/order-management")
                },3000)
            }
            else{
              firetoast(response.data.error||response.data.message,"default-error")
            }
        }
        catch(e){
            console.log(e)
        }
      }
  }
  return (
    <div className="mt-5">
      <div className="d-flex justify-content-between">
        <h3 className="ftw-400">Vendor Shipping Process</h3>
      </div>
      <div className="card mt-2">
        <div className="card-body">
          <div className="container">
            <div>
              <label>Select Shipping Method</label>
              <div>
                <div className="d-flex" style={{ alignItems: "end" }}>
                  <div className="cs-bi-radios">
                    <label>
                      <input
                        type="radio"
                        className="cs-bi-radios-input"
                        name="allowDelivery"
                        defaultChecked={option === 1}
                        onChange={() => setOption(1)}
                      />{" "}
                      By Courier Service
                    </label>
                  </div>
                  <div className="cs-bi-radios">
                    <label>
                      <input
                        type="radio"
                        className="cs-bi-radios-input"
                        name="allowDelivery"
                        defaultChecked={option === 2}
                        onChange={() => setOption(2)}
                      />{" "}
                      By Vendor Person
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              {option === 1 && <>
              <h6>Courier Service Details</h6>
                <div className="row mt-2">
                  <div className="col-4">
                      <label>Courier Service </label>
                  <select className="form-control" onChange={(e)=>{setSelectedService(JSON.parse(e.target.value).CourierID)
                setServiceName(JSON.parse(e.target.value).CourierName)
                }}>
                      <option value="Select">Select Service</option>
                      {records.map((item,index)=><option value={JSON.stringify(item)}>{item.CourierName}</option>)}\
                  </select>
                  </div>
                  {selectedService && selectedService !== "Select" && <div className="col-4">
                      <label>Tracking Label</label>
                      <input className="form-control" onChange={(e)=>setTrackingNumber(e.target.value)}/>
                  </div>}
                  </div>
              </>}
              {option === 2 && <>
              <h6>Vendor Person Details</h6>
                <div className="row mt-2">
                  <div className="col-4">
                  <label>Vendor Contact</label>
                      <input className="form-control" onChange={(e)=>setVendorNumber(e.target.value)}/>
                  </div>
                 
                  </div>
              </>}
              
          </div>
          <div className="mt-3">
                <button className="btn btn-default" onClick={()=>saveAndUpdate()}>Save and Update</button>
          </div>
          </div>
        
        </div>
      </div>
    </div>
  );
}
