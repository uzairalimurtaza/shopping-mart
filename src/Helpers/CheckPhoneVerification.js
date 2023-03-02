import { CurrentUser } from "./Auth";
export function IsPhoneVerified() {
  if (CurrentUser.PhoneVerified === "Y") {
    return true;
  } else {
    return false;
  }
}
