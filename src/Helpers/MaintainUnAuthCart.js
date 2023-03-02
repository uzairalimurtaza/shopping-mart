import firetoast from "./FireToast";

function MaintainUnAuthCart(data) {
  // return null;
  console.log(data);
  var localCart = JSON.parse(localStorage.getItem("uLC"));

  if (localCart && localCart.length > 0) {
    var array = localCart;
    let found = false;
    let str = JSON.stringify(data);
    for (let i = 0; i < array.length; i++) {
      if (array[i] === str) {
        found = true;
      }
    }
    if (found) {
      firetoast("Item already exists in cart!", "info", 3000, "top-center");
    } else {
      array.push(JSON.stringify(data));
      localStorage.setItem("uLC", JSON.stringify(array));
      // firetoast("Item Added To Cart", "success", 3000, "top-center");
    }
  } else {
    var array = [];
    array.push(JSON.stringify(data));
    localStorage.setItem("uLC", JSON.stringify(array));
    firetoast("Item Added To Cart", "success", 3000, "top-center");
  }
}
export default MaintainUnAuthCart;
