import "firebase/firestore";
import "firebase/analytics";
import { CurrentUser } from "./../../../../Helpers/Auth";
function SupportChatMessages({ Messages }) {
  return (
    <>
      {Messages ? (
        <div className="messages-chat">
          {Messages.map((message, index) => (
            <>
              {parseInt(message.ender_id) === parseInt(CurrentUser.UserID) ? (
                <>
                  <div className="message">
                    <p className="text-chat"> {message.text}</p>
                  </div>
                  <p className="time"> 14h58</p>
                </>
              ) : (
                <div className="response">
                  <p className="text-chat"> {message.text}</p>
                </div>
              )}
            </>
          ))}
        </div>
      ) : null}
    </>
  );
}
export default SupportChatMessages;
{
  /* <div className="message">
<p className="text-chat"> Hi, how are you ? </p>
</div>
<div className="message">
<p className="text-chat">
  {" "}
  What are you doing tonight ? Want to go take a drink ?
</p>
</div>
<p className="time"> 14h58</p>
<div className="message text-only">
<div className="response">
  <p className="text-chat"> Hey Megan ! It's been a while 😃</p>
</div>
</div>
<div className="message text-only">
<div className="response">
  <p className="text-chat"> When can we meet ?</p>
</div>
</div>
<p className="response-time time"> 15h04</p>
<div className="message">
<p className="text-chat"> 9 pm at the bar if possible 😳</p>
</div>
<p className="time"> 15h09</p>){" "} */
}
