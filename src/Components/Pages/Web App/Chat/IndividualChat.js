import { WebsiteHeader } from "./../Layout/Header";
import { Breadcrumb } from "reactstrap";
import { BreadcrumbItem } from "reactstrap";
import { NewsLetter } from "./../Layout/NewsLetter";
import { Footer } from "./../Layout/Footer";
import "firebase/firestore";
import "firebase/analytics";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useEffect, useState, useRef } from "react";
import { firestore_db } from "./../../../../Helpers/Firebase";
import { useParams } from "react-router-dom";
import { CurrentUser } from "./../../../../Helpers/Auth";
import BanglaBazarApi from "./../../../Api/BanglaBazarApi";
import Endpoint from "./../../../../Utils/Endpoint";
import firetoast from "./../../../../Helpers/FireToast";
import { serverTimestamp } from "firebase/firestore";
function IndividualChat() {
  const { reciever_id } = useParams();
  const [UserProfile, setUserProfile] = useState(null);
  const [RoomId, setRoomId] = useState(null);
  const [Users, setUser] = useState([]);
  const [ActiveDoc, setActiveDoc] = useState(null);
  const [Messages, setMessages] = useState([]);
  var getUserDetail = async () => {
    try {
      var response = await BanglaBazarApi.get(
        `${Endpoint}/api/admin/get/${reciever_id}`
      );
      setUserProfile(response.data.profile);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(async () => {
    await getUserDetail();
    await Fetchdata();
  }, []);

  const Fetchdata = async () => {
    const ref = await firestore_db
      .collection("Users")
      .where(
        "receiver_id",
        "==",
        parseInt(reciever_id),
        "&&",
        "sender_id",
        "==",
        parseInt(CurrentUser.UserID)
      )
      .get();
    const ref2 = await firestore_db
      .collection("Users")
      .where(
        "receiver_id",
        "==",
        parseInt(CurrentUser.UserID),
        "&&",
        "sender_id",
        "==",
        parseInt(reciever_id)
      )
      .get();

    if (ref.docs.length === 0 && ref2.docs.length === 0) {
      await firestore_db
        .collection("Users")
        .doc()
        .set({
          receiver_id: parseInt(reciever_id),
          receiver_url: UserProfile.ProfilePic ? UserProfile.ProfilePic : "",
          receiver_name: UserProfile.UserName,
          sender_id: parseInt(CurrentUser.UserID),
          sender_name: CurrentUser.UserName,
          sender_url: CurrentUser.ProfilePic ? CurrentUser.ProfilePic : "",
          time_stamp: serverTimestamp(),
        });
      var tempUser = await firestore_db
        .collection("Users")
        .where(
          "receiver_id",
          "==",
          parseInt(reciever_id),
          "&&",
          "sender_id",
          "==",
          parseInt(CurrentUser.UserID)
        )
        .get();
      var tempArray = [];
      tempUser.docs.forEach((doc) => {
        var obj = {
          doc_id: doc.id,
          doc_data: doc.data(),
        };
        tempArray.push(obj);
      });
      setUser(tempArray);
      OpenSelectedChat(tempArray[0]);
    } else {
      var tempArray = [];
      ref.docs.forEach((doc) => {
        var obj = {
          doc_id: doc.id,
          doc_data: doc.data(),
        };
        tempArray.push(obj);
      });
      setUser(tempArray);
      OpenSelectedChat(tempArray[0]);
    }
  };

  var getMessages = async (id) => {
    const messagesRef = firestore_db.collection("messages");
    const query = await messagesRef
      .where("room_id", "==", id)
      .orderBy("time_stamp")
      .get();
    var tempArray = [];
    query.docs.forEach((doc) => {
      tempArray.push(doc.data());
    });
    setMessages(tempArray);
  };
  function ChatRoom() {
    const dummy = useRef();

    const messagesRef = firestore_db.collection("messages");
    const query = messagesRef.where("room_id", "==", RoomId);
    // const messages = useCollectionData(query);
    // console.log(messages[0]);
    const [formValue, setFormValue] = useState("");

    const sendMessage = async (e) => {
      e.preventDefault();

      await messagesRef.add({
        text: formValue,
        time_stamp: serverTimestamp(),
        receiver_id: parseInt(reciever_id),
        sender_id: parseInt(CurrentUser.UserID),
        room_id: RoomId,
      });

      setFormValue("");
      dummy.current.scrollIntoView({ behavior: "smooth" });
    };

    return <></>;
  }
  function ChatMessage(props) {
    const { text, sender_id } = props.message;

    return (
      <div>
        {parseInt(sender_id) === parseInt(CurrentUser.UserID) ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "end",
            }}
          >
            {text}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
            }}
          >
            {text}
          </div>
        )}
      </div>
    );
  }
  var OpenSelectedChat = (doc) => {
    setRoomId(doc.doc_id);
    setActiveDoc(doc);
    // getMessages(doc.doc_id);
  };
  var NotifyUser = async () => {
    try {
      await BanglaBazarApi.post(`${Endpoint}/api/admin/notify-user`, {
        senderID: parseInt(CurrentUser.UserID),
        receiverID: ActiveDoc["doc_data"]["receiver_id"],
      });
    } catch (e) {
      console.log(e);
    }
  };
  var sendText = async () => {
    var value = document.getElementById("chat-input").value;
    if (!value) {
      return firetoast("Chat can't be empty", "default-error");
    } else {
      const messagesRef = firestore_db.collection("messages");
      // const query = messagesRef.where("room_id", "==", RoomId);
      await messagesRef.add({
        text: value,
        time_stamp: serverTimestamp(),
        receiver_id: parseInt(reciever_id),
        sender_id: parseInt(CurrentUser.UserID),
        room_id: RoomId,
      });

      getMessages(RoomId);
      document.getElementById("chat-input").value = "";
      NotifyUser();
    }
  };
  function SupportChatMessages({ RoomId }) {
    const [Messages, setMessages] = useState([]);
    const messagesRef = firestore_db.collection("messages");
    const query = messagesRef.where("room_id", "==", RoomId);
    const haha = useCollectionData(query);
    var scrollToBottom = () => {
      var div = document.getElementById("messages-chat");
      div.scrollTop = div.scrollHeight - div.clientHeight;
    };
    useEffect(async () => {
      if (RoomId) {
        const messagesRef = firestore_db.collection("messages");
        const temp_messages = await messagesRef
          .where("room_id", "==", RoomId)
          .orderBy("time_stamp")
          .onSnapshot((messages) => {
            var tempArray = [];
            messages.docs.forEach((doc) => {
              tempArray.push(doc.data());
            });
            setMessages(tempArray);
          });
        scrollToBottom();
      }
    }, [RoomId]);

    return (
      <>
        <div
          className="messages-chat"
          id="messages-chat"
          style={{ height: "525px" }}
        >
          {Messages.map((message, index) => (
            <>
              {parseInt(message.sender_id) === parseInt(CurrentUser.UserID) ? (
                <div
                  className="response"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "end",
                    marginTop: "10px",
                  }}
                >
                  <p className="text-chat"> {message.text}</p>
                </div>
              ) : (
                <>
                  <div
                    className="message"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "start",
                      marginTop: "10px",
                    }}
                  >
                    <p className="text-chat"> {message.text}</p>
                  </div>
                  <p className="time"> 14h58</p>
                </>
              )}
            </>
          ))}
        </div>
      </>
    );
  }
  return (
    <>
      <WebsiteHeader />

      <div className="container">
        <>
          <div className="pt-2 pb-0">
            <Breadcrumb listTag="div">
              <BreadcrumbItem
                href="/"
                tag="a"
                className="td-none"
                style={{ color: "#B1B1B1" }}
              >
                Home
              </BreadcrumbItem>
              <BreadcrumbItem
                href="#"
                tag="a"
                className="td-none"
                style={{ color: "#787878" }}
              >
                Support Chat
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
        </>

        <section className="chatting">
          <div className="container">
            <div className="row">
              {/* <section className="discussions">
                <div className="discussion search">
                  <h4 className="ftw-400">Chats</h4>
                </div>

                {Users.map((user, index) => (
                  <div
                    className="discussion message-active"
                    key={index}
                    onClick={() => OpenSelectedChat(user)}
                  >
                    <div
                      className="photo"
                      style={{
                        backgroundImage:
                          "url" +
                          "(" +
                          `${Endpoint}/${user.doc_data.sender_url}` +
                          ")",
                      }}
                    ></div>
                    <div className="desc-contact">
                      <p className="name mt-2">{user.doc_data.sender_name}</p>
                    </div>
                  </div>
                ))}
              </section> */}
              <section className="chat w-100" style={{ padding: "12px" }}>
                <div className="header-chat">
                  <div
                    className="d-flex align-items-center"
                    style={{ marginLeft: "25px" }}
                  >
                    <div>
                      <img
                        className="reciever-image "
                        src={`${Endpoint}/${
                          ActiveDoc && ActiveDoc.doc_data.receiver_url
                        }`}
                      />
                    </div>
                    <div>
                      {" "}
                      <p className="name">
                        {ActiveDoc && ActiveDoc.doc_data.receiver_name}
                      </p>
                    </div>
                  </div>
                </div>
                {RoomId && <SupportChatMessages RoomId={RoomId} />}
                <div
                  className="footer-chat"
                  style={{ width: "100%", position: "relative" }}
                >
                  <i
                    className="icon fa fa-smile-o clickable"
                    style={{ fontSize: "25pt" }}
                    aria-hidden="true"
                  ></i>
                  <input
                    type="text"
                    className="write-message"
                    placeholder="Type your message here"
                    id="chat-input"
                  ></input>
                  <i
                    className="icon send fas fa-paper-plane clickable"
                    aria-hidden="true"
                    onClick={() => sendText()}
                  ></i>
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>
      <NewsLetter />
      <Footer />
    </>
  );
}
export default IndividualChat;
