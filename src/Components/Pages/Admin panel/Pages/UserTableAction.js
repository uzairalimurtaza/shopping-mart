import {
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import Endpoint from "./../../../../Utils/Endpoint";
import { GetNotificationType } from "./../../../../Helpers/GetNotificationTypes";
import BanglaBazarApi from './../../../Api/BanglaBazarApi';

function UserTableAction(props) {
  const [modal, setModal] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [admin, setAdmin] = useState("");
  const [vendor, setVendor] = useState("");
  const [deliveryPerson, setDeliveryPerson] = useState("");
  const [customer, setCustomer] = useState("");
  const toggle = () => setModal(!modal);
  const toggle2 = () => setModal2(!modal2);

  let history = useHistory();

  useEffect(() => {
    let record = props.record;
    setAdmin(record.Admin);
    setVendor(record.Vendor);
    setDeliveryPerson(record.DeliveryPerson);
    setCustomer(record.Customer);
  }, []);
  var deleteUser = async () => {
    try {
      var response = await BanglaBazarApi.delete(
        `${Endpoint}/api/admin/delete/${props.id}`
      );
      if (response.data.status) {
        toast.success("User Removed", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        toggle();
        props.getUsers();
      }
    } catch (e) {
      console.log(e);
    }
  };
  var markStatus = async (status) => {
    try {
      var form = new URLSearchParams();
      form.append("UserID", props.id);
      form.append("Active", status);
      var response = await BanglaBazarApi.put(Endpoint + "/api/admin/status", form);
      if (response.data.status) {
        toast.success("Status Changed Successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        props.getUsers();
      } else {
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (e) {
      if (e.response) {
        return toast.error(e.response.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      console.log(e);
    }
  };

  var updateRoles = async () => {
    try {
      var form = new URLSearchParams();
      form.append("UserID", props.id);
      form.append(
        "Customer",
        customer == null || customer === "" ? "N" : customer
      );
      form.append(
        "DeliveryPerson",
        deliveryPerson == null || deliveryPerson === "" ? "N" : deliveryPerson
      );
      form.append("Vendor", vendor == null || vendor === "" ? "N" : vendor);
      form.append("Admin", admin == null || admin === "" ? "N" : admin);
      var response = await BanglaBazarApi.put(`${Endpoint}/api/admin/setRoles`, form);
      if (response.data.status) {
        toast.success("Roles Updated Successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        props.getUsers();
        generateNotification(props.id);
        setTimeout(() => {
          toggle2();
        }, 1500);
      } else {
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (e) {
      console.log(e);
      return toast.error("Something went wrong!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  var generateNotification = async (userId) => {
    try {
      let form = new URLSearchParams();
      form.append("TypeID", await GetNotificationType("role"));
      form.append("UserID", userId);
      var response = await BanglaBazarApi.post(`${Endpoint}/api/admin/users`, form);
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  return (
    <>
      <UncontrolledButtonDropdown>
        <DropdownToggle
          className=" btn-light"
          onClick={() => history.push(`/panel/userEdit/${props.id}`)}
        >
          <i className="far fa-edit text-dark"></i>
        </DropdownToggle>
        {/* <DropdownMenu>
          <DropdownItem
            onClick={() => history.push(`/panel/userEdit/${props.id}`)}
          >
            Edit
          </DropdownItem>
          {props.record.SuperAdmin !== "Y" &&
            props.status !== "Y" &&
            props.status !== "N" && (
              <>
                <DropdownItem onClick={() => markStatus("Y")}>
                  Set Active
                </DropdownItem>
                <DropdownItem onClick={() => markStatus("N")}>
                  Set Inactive
                </DropdownItem>
              </>
            )}
          {props.record.SuperAdmin !== "Y" && props.status === "Y" && (
            <DropdownItem onClick={() => markStatus("N")}>
              Set Inactive
            </DropdownItem>
          )}
          {props.record.SuperAdmin !== "Y" && props.status === "N" && (
            <DropdownItem onClick={() => markStatus("Y")}>
              Set Active
            </DropdownItem>
          )}
          {props.record.SuperAdmin !== "Y" && (
            <DropdownItem onClick={() => toggle2()}>Manage Role</DropdownItem>
          )}
        </DropdownMenu> */}
      </UncontrolledButtonDropdown>
      <div>
        <Modal isOpen={modal} toggle={toggle} size="lg" centered>
          <ModalHeader toggle={toggle}>Delete User</ModalHeader>
          <ModalBody>
            <p className="text-dark">
              Are you sure you want to remove this user? This action is
              irreversible!
            </p>
          </ModalBody>
          <ModalFooter>
            <Button className="btn-white" onClick={toggle}>
              Cancel
            </Button>{" "}
            <Button className="btn-default" onClick={() => deleteUser()}>
              Remove
            </Button>
          </ModalFooter>
        </Modal>
      </div>
      <div>
        <Modal isOpen={modal2} toggle={toggle2} size="md" centered>
          <ModalHeader toggle={toggle2}>Manage Role</ModalHeader>
          <ModalBody>
            <div className="text-dark">
              <div className="text-center h6 ftw-400">Available Roles</div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    id="checkbox2"
                    defaultChecked={admin === "Y"}
                    onChange={() => setAdmin(admin === "Y" ? "N" : "Y")}
                  />{" "}
                  Admin
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    id="checkbox2"
                    defaultChecked={customer === "Y"}
                    onChange={() => setCustomer(customer === "Y" ? "N" : "Y")}
                  />{" "}
                  Customer
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    id="checkbox2"
                    defaultChecked={deliveryPerson === "Y"}
                    onChange={() =>
                      setDeliveryPerson(deliveryPerson === "Y" ? "N" : "Y")
                    }
                  />{" "}
                  Delivery Person
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    id="checkbox2"
                    defaultChecked={vendor === "Y"}
                    onChange={() => setVendor(vendor === "Y" ? "N" : "Y")}
                  />{" "}
                  Vendor
                </label>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button className="btn-white" onClick={toggle2}>
              Cancel
            </Button>{" "}
            <Button className="btn-default" onClick={() => updateRoles()}>
              Update Role
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
}
export default UserTableAction;
