//START FROM HERE
//line updateQuantity()
// ISSUE1: Your JavaScript code sends a POST request to the /checkout endpoint, and if the payment is successful,
//it stores the transaction and responds with the CheckoutRequestID.
// The client then uses this ID to poll for the transaction status.
// ISSUE2: Update the CallBackURL to point to your live server or Ngrok tunnel if you're using it locally. for full testing purposses.
// I'll use portforwadding of vscode

function closeNotificationWindow() {
  var notification = document.getElementById("notificationwindow");
  notification.classList.add("hidden"); // Hide the notification
}

window.onload = function () {
  setTimeout(closeNotificationWindow, 1000);
};

function openCartWindow() {
  console.log("window");

  var cart = document.getElementById("cart");

  // Check if the cart is currently visible
  if (cart.style.display === "none" || cart.style.display === "") {
    // Show the cart
    cart.style.display = "block";
    cart.style.position = "absolute"; // Optional, if you want to keep the cart fixed
  } else {
    // Hide the cart
    cart.style.display = "none";
  }
}

function notificationwindow(message) {
  console.log("about to popup");
  var notification = document.getElementById("notificationwindow");

  if (notification) {
    notification.innerHTML = message;
    notification.classList.remove("hidden"); // Show the notification
    // Optionally, hide the notification after a few seconds
    setTimeout(() => {
      notification.classList.add("hidden"); // Hide the notification
    }, 5000);
  } else {
    console.error("Notification element not found");
  }
}

function makeItemVisible(item) {
  switch (item) {
    case "broilers":
      elementItem = document.getElementById(`cart-${item}`);
      elementItem.classList.remove("hidden");
    //
    case "kienyeji":
      elementItem = document.getElementById(`cart-${item}`);
      elementItem.classList.remove("hidden");
    //
    case "eggs":
      elementItem = document.getElementById(`cart-${item}`);
      elementItem.classList.remove("hidden");
    //
    default:
      console.log("Error making item visible");
  }
}

//Function below might be redundant.
function CheckBrowser() {
  if ("localStorage" in window && window["localStorage"] !== null) {
    // We can use localStorage object to store data.
    return true;
  } else {
    return false;
  }
}

// Dynamically populate the table with shopping list items.
//Step below can be done via PHP and AJAX, too.
function doShowAll() {
  if (CheckBrowser()) {
    var key = "";
    var list = "<tr><th>Item</th><th>Value</th></tr>\n";
    var i = 0;
    //For a more advanced feature, you can set a cap on max items in the cart.
    for (i = 0; i <= localStorage.length - 1; i++) {
      key = localStorage.key(i);
      list +=
        "<tr><td>" +
        key +
        "</td>\n<td>" +
        localStorage.getItem(key) +
        "</td></tr>\n";
    }
    //If no item exists in the cart.
    if (list == "<tr><th>Item</th><th>Value</th></tr>\n") {
      list += "<tr><td><i>empty</i></td>\n<td><i>empty</i></td></tr>\n";
    }
    //Bind the data to HTML table.
    //You can use jQuery, too.
    document.getElementById("list").innerHTML = list;
  } else {
    alert("Cannot save shopping list as your browser does not support HTML 5");
  }
}

//Noramally this prices will be fetched via a websocket
let broilers = 480;
let kienyeji = 1000;
const eggs = 525;

let broilersQuantity = 10;
let kienyejiQuantity = 10;
const eggsQuantity = 10;

let broilersCartQuantity = 0;
let kienyejiCartQuantity = 0;
let eggsCartQuantity = 0;

let totalItems = 0;
let totalPrice = 0;

let checkoutRequestIdstr = "";

let globalPayload = {};

//WEBSOCKET SECTION
const ws = new WebSocket("wss://kukuplaza.co.ke:8080");

//gets quanties
ws.onmessage = function (event) {
  const data = JSON.parse(event.data);

  if (data.broilers !== undefined) {
    broilersQuantity = data.broilers;
  }

  if (data.kienyeji !== undefined) {
    kienyejiQuantity = data.kienyeji;
  }
  displayPrices();
};

ws.onclose = function () {
  console.log("WebSocket connection closed");
};

async function fetchAndDisplayPrices() {
  try {
    // Fetch the prices from the backend
    const response = await fetch("/get-prices");
    const prices = await response.json(); // Assuming your API returns a JSON with prices

    // Update the Broiler and Kienyeji prices in the DOM
    broilers = prices.broilerPrice;
    kienyeji = prices.kienyejiPrice;
  } catch (error) {
    console.error("Error fetching prices:", error);
  }
}

// display prices
function displayPrices() {
  document.getElementById("broilers-price").innerText = `KES ${broilers}`;
  document.getElementById("kienyeji-price").innerText = `KES ${kienyeji}`;
  document.getElementById("eggs-price").innerText = `KES ${eggs}`;

  document.getElementById(
    "remaining-broilers"
  ).innerText = `remaining: ${broilersQuantity}`;
  document.getElementById(
    "remaining-kienyeji"
  ).innerText = `remaining: ${kienyejiQuantity}`;
  document.getElementById(
    "remaining-eggs"
  ).innerText = `remaining: ${eggsQuantity}`;
}

window.onload = displayPrices();

function addCartQuantity(item) {
  console.log("item", item);
  switch (item) {
    case "broilers":
      broilersCartQuantity += 1;
      return broilersCartQuantity;
    case "kienyeji":
      kienyejiCartQuantity += 1;
      return kienyejiCartQuantity;
    case "eggs":
      eggsCartQuantity += 1;
      return eggsCartQuantity;
    default:
      console.log("Error while running code");
      return 0;
  }
}

function decreaseCartQuantity(item) {
  console.log("item", item);
  switch (item) {
    case "broilers":
      broilersCartQuantity -= 1;
      return broilersCartQuantity;
    case "kienyeji":
      kienyejiCartQuantity -= 1;
      return kienyejiCartQuantity;
    case "eggs":
      eggsCartQuantity -= 1;
      return eggsCartQuantity;
    default:
      console.log("Error while running code");
      return 0;
  }
}

function getPrice(item) {
  switch (item) {
    case "broilers":
      return broilers;
    case "kienyeji":
      return kienyeji;
    case "eggs":
      return eggs;
    default:
      console.log("Invalid item");
      return 0;
  }
}

function getQuantity(item) {
  switch (item) {
    case "broilers":
      return broilersQuantity;
    case "kienyeji":
      return kienyejiQuantity;
    case "eggs":
      return eggsQuantity;
    default:
      console.log("Invalid item");
      return 0;
  }
}

function getCartQuantity(item) {
  switch (item) {
    case "broilers":
      return broilersCartQuantity;
    case "kienyeji":
      return kienyejiCartQuantity;
    case "eggs":
      return eggsCartQuantity;
    default:
      console.log("Invalid item");
      return 0;
  }
}

function updateQuantity(item, action) {
  quantity = 0;
  let price = getPrice(item);
  console.log("this is action:", action);
  console.log("this is item:", item);
  if (action === "add") {
    //you need to add quantity
    console.log("got add");
    switch (item) {
      case "broilers":
        if (broilersCartQuantity < broilersQuantity) {
          quantity = addCartQuantity(item);
        } else {
          quantity = broilersQuantity;
          return notificationwindow(
            `Sorry! &#128534; Only ${broilersQuantity} ${item} were available.`
          );
        }
        break;
      case "kienyeji":
        if (kienyejiCartQuantity < kienyejiQuantity) {
          quantity = addCartQuantity(item);
        } else {
          quantity = kienyejiQuantity;
          notificationwindow(
            `Sorry! &#128534; Only ${broilersQuantity} ${item} were available.`
          );
        }
        break;
      case "eggs":
        if (eggsCartQuantity < eggsQuantity) {
          quantity = addCartQuantity(item);
        } else {
          quantity = eggsQuantity;
          notificationwindow(
            `Sorry! &#128534; Only ${broilersQuantity} ${item} were available.`
          );
        }
        break;
      default:
        console.log("Error updating quantity");
    }
  } else {
    quantity = decreaseCartQuantity(item);
    //prevent subtraction that leads to negative numbers
    if (quantity < 0) {
      quantity = addCartQuantity(item);
    }
  }
  //update the value on the element
  thElementQuantity = document.getElementById(`${item}-quantity`);
  thElementQuantity.innerHTML = `
                            <th id="${item}-quantity">
                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000" class="mx-1 controls" onclick="updateQuantity('${item}', 'minus')"><path d="M232-444v-72h496v72H232Z"/></svg>
                            ${quantity}
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="20px" fill="#000000" class="mx-1 controls" onclick="updateQuantity('${item}', 'add')"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
                            </th>    
                            `;
  thElementTotal = document.getElementById(`${item}-total`);
  thElementTotal.innerHTML = `${quantity * getPrice(item)}`;

  totalItems = broilersCartQuantity + kienyejiCartQuantity + eggsCartQuantity;
  totalPrice =
    broilersCartQuantity * broilers +
    kienyejiCartQuantity * kienyeji +
    eggsCartQuantity * eggs;

  itemsNo = document.getElementById("total-items");
  itemsNo.innerHTML = `${totalItems}`;

  itemsNo = document.getElementById("total-price");
  itemsNo.innerHTML = `${totalPrice}`;
}

/////////////
function displayToCart(item) {
  console.log("got item:", item);
  let price = getPrice(item); // Ensure this function returns the correct price
  let quantity = 0; // Set default quantity

  // First check if the item is already in the cart
  cartItem = document.getElementById(`cart-${item}`);

  if (cartItem !== null) {
    // If the item exists, just increase the quantity

    // Check stock levels
    switch (item) {
      case "broilers":
        makeItemVisible(item);
        if (broilersCartQuantity < broilersQuantity) {
          addCartQuantity(item);
        } else {
          return notificationwindow(
            `Sorry! &#128534; Only ${broilersQuantity} ${item} were available.`
          );
        }
        quantity = broilersCartQuantity;
        break;
      case "kienyeji":
        makeItemVisible(item);
        if (kienyejiCartQuantity < kienyejiQuantity) {
          addCartQuantity(item);
        } else {
          return notificationwindow(
            `Sorry! &#128534; Only ${kienyejiQuantity} ${item} were available.`
          );
        }
        quantity = kienyejiCartQuantity;
        break;
      case "eggs":
        makeItemVisible(item);
        if (eggsCartQuantity < eggsQuantity) {
          addCartQuantity(item);
        } else {
          return notificationwindow(
            `Sorry! &#128534; Only ${eggsQuantity} ${item} were available.`
          );
        }
        quantity = eggsCartQuantity;
        break;
      default:
        console.log("Error while running codeee");
    }

    // Update the cart item
    cartItem.innerHTML = `<th>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323"><path d="M360-640v-80h240v80H360ZM280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM40-800v-80h131l170 360h280l156-280h91L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68.5-39t-1.5-79l54-98-144-304H40Z"/></svg>
                                </th>
                                <th>${item}</th>
                                <th>${price}</th>
                                <th id="${item}-quantity">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000" class="mx-1 controls" onclick="updateQuantity('${item}', 'minus')"><path d="M232-444v-72h496v72H232Z"/></svg>
                                    ${quantity}
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="20px" fill="#000000" class="mx-1 controls" onclick="updateQuantity('${item}', 'add')"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
                                </th>
                                <th id="${item}-total">${
      price * quantity
    }</th>`;
    totalPrice =
      broilersCartQuantity * broilers +
      kienyejiCartQuantity * kienyeji +
      eggsCartQuantity * eggs;
    itemsNo = document.getElementById("total-price");
    itemsNo.innerHTML = `${totalPrice}`;
    totalItems = broilersCartQuantity + kienyejiCartQuantity + eggsCartQuantity;
    //updating items number
    itemsNo = document.getElementById("total-items");
    itemsNo.innerHTML = `${totalItems}`;
  } else {
    // The item is not in the cart, add a new row
    quantity = addCartQuantity(item);

    var cart = document.getElementById("tbody-cart");
    cart.innerHTML += `<tr id="cart-${item}">
                            <th>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323"><path d="M360-640v-80h240v80H360ZM280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM40-800v-80h131l170 360h280l156-280h91L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68.5-39t-1.5-79l54-98-144-304H40Z"/></svg>
                          </th>
                          <th>${item}</th>
                          <th>${price}</th>
                          <th>${quantity}</th>
                          <th>${price * quantity}</th>
                          </tr>`;
  }

  // Save the item to local storage
  SaveItem(item, quantity);
}

//for saving item
function SaveItem(item, quantity) {
  // Convert the object to a string and store it in localStorage
  localStorage.setItem(item, quantity);
}

function checkItem(item) {
  // Get the item from localStorage
  var storedItem = localStorage.getItem(item);

  if (storedItem) {
    //return true if item stored
    return true;
  } else {
    return false;
  }
}

//Change an existing key-value in HTML5 storage.
function ModifyItem() {
  var name1 = document.forms.ShoppingList.name.value;
  var data1 = document.forms.ShoppingList.data.value;
  //check if name1 is already exists

  //Check if key exists.
  if (localStorage.getItem(name1) != null) {
    //update
    localStorage.setItem(name1, data1);
    document.forms.ShoppingList.data.value = localStorage.getItem(name1);
  }

  doShowAll();
}

function RemoveItem() {
  var name = document.forms.ShoppingList.name.value;
  document.forms.ShoppingList.data.value = localStorage.removeItem(name);
  doShowAll();
}

//clearing all function
function ClearAll() {
  console.log("cleared all");
  localStorage.clear();
  let cartItems = document.getElementsByClassName("cart-items");
  for (let i = 0; i < cartItems.length; i++) {
    cartItems[i].classList.add("hidden"); // Add the class 'hidden' to each element
  }
  notificationwindow("Cart is cleared");
  broilersCartQuantity = 0;
  kienyejiCartQuantity = 0;
  eggsCartQuantity = 0;

  totalItems = 0;
  totalPrice = 0;
  totalItems = broilersCartQuantity + kienyejiCartQuantity + eggsCartQuantity;
  totalPrice =
    broilersCartQuantity * broilers +
    kienyejiCartQuantity * kienyeji +
    eggsCartQuantity * eggs;

  itemsNo = document.getElementById("total-items");
  itemsNo.innerHTML = `${totalItems}`;

  itemsNo = document.getElementById("total-price");
  itemsNo.innerHTML = `${totalPrice}`;
  doShowAll();
}

//When checked user will be able allowed to enter promo code
function handlePromoCheckboxClick() {
  var checkbox = document.getElementById("promo-code-checkbox");
  var inputs = document.querySelectorAll("#code-input input");

  if (checkbox.checked) {
    console.log("Checkbox is checked");
    inputs.forEach(function (input) {
      input.disabled = false;
    });
  } else {
    console.log("Checkbox is unchecked");
    inputs.forEach(function (input) {
      input.disabled = true;
    });
  }
}

//create multiple input boxes where each box holds a single character (like for entering a verification code or OTP
function moveToNext(current, nextFieldId) {
  if (current.value.length === 1) {
    document.getElementById(nextFieldId).focus();
  }
}

function openPromoWindow() {
  var information = document.getElementById("promo-code-help-info");

  // Check if the information element is currently visible or hidden
  if (information.classList.contains("hidden")) {
    // If hidden, show it
    information.classList.remove("hidden");
  } else {
    // If visible, hide it
    information.classList.add("hidden");
  }
}

// function processingPayment(event) {
//   // Prevent form submission and page refresh
//   // event.preventDefault();

//   // Hide the checkout button and show the loader
//   // document.getElementById("checkout").classList.add("hidden");
//   document.getElementById("checkout").style.display = "none";
//   document.getElementById("checkout-svg").classList.add("hidden"); // Hide the checkout SVG
//   document.getElementById("loader-checkout").classList.remove("hidden"); // Show the loader

//   // Display the processing message and loader
//   // var h2Element = document.getElementById("position-h2");
//   // h2Element.classList.remove("hidden");

//   // var divElement = document.getElementById("position-outer");
//   // divElement.style.display = "flex";

//   // Gather form data
//   var formData = new FormData(document.getElementById("checkout-form"));
//   console.log("This is formData: ", formData);
//   globalPayload.quantity = {
//     broilers: broilersQuantity, // Assuming these variables are defined
//     kienyeji: kienyejiQuantity,
//   };
//   globalPayload.totalprice = totalPrice; // Ensure there is no extra space in "totalprice"
//   globalPayload.broilers = broilersCartQuantity > 0; // Boolean indicating whether there are broilers in the cart
//   globalPayload.kienyeji = kienyejiCartQuantity > 0; // Boolean indicating whether there are kienyeji in the cart
//   globalPayload.name = formData.name;
//   globalPayload.phone =
//     formData["phone-option"] === "no"
//       ? formData["phone-number"]
//       : formData["mpesa-number"];
//   globalPayload.location = "mombasa"; // Default location; you can modify based on form data
//   globalPayload.mpesa_number = formData["mpesa-number"];

//   // Simulate processing delay (optional)
//   setTimeout(function () {
//     // Send the form data using fetch
//     fetch("localhost:8078/checkout", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(globalPayload),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         // Handle successful response
//         console.log("Payment processed:", data);

//         // Hide processing UI after handling
//         h2Element.classList.add("hidden");
//         divElement.style.display = "none";

//         if (data.success && data.checkoutRequestId) {
//           //I need to change here so that it receives the checkoutRequestId
//           try {
//             const response = fetch(
//               `localhost:8078/check-transaction-status?checkoutRequestId=${checkoutRequestId}`
//             );
//             const result = response.json();

//             if (result.status === "pending") {
//               // Keep polling after a delay
//               setTimeout(() => pollTransactionStatus(checkoutRequestId), 3000); // Poll every 3 seconds
//             } else if (result.status === "complete") {
//               // Redirect to the success page
//               checkoutRequestIdstr += `${checkoutRequestId}`;
//               localStorage.setItem('globalPayload', JSON.stringify(globalPayload));
//               localStorage.setItem('checkoutRequestIdstr', checkoutRequestIdstr);
//               document
//                 .getElementById("payment-successfull")
//                 .classList.remove("hidden"); //
//               console.log("global payload:" + globalPayload);
//               // storing
//             } else if (result.status === "failed") {
//               // Redirect to the failed page
//               console.log("FAAAAIIILLLEDD");
//             }
//           } catch (error) {
//             console.error("Error checking transaction status:", error);
//             console.log("FAILED");
//           }
//         } else {
//           console.error("Failed to process request:", data.message);
//         }

//         // Optionally, redirect or show success message
//         // window.location.href = "/success";
//       })
//       .catch((error) => {
//         // Handle errors
//         console.error("Error processing payment:", error);
//       });
//   }, 1000); // 60-second delay

//   return false; // Prevent form from submitting and reloading the page
// }

async function processingPayment(event) {
  // Prevent form submission and page refresh
  event.preventDefault();

  // Hide the checkout button and show the loader
  document.getElementById("checkout").style.display = "none";
  document.getElementById("checkout-svg").classList.add("hidden"); // Hide the checkout SVG
  document.getElementById("loader-checkout").classList.remove("hidden"); // Show the loader
  document.getElementById("checkout-form").style.opacity = "0.1";
  document.getElementById("checkout-form").style.pointerEvents = "none";

  // Gather form data
  var formData = new FormData(document.getElementById("checkout-form"));
  console.log("This is formData: ", formData);

  // Prepare the request payload
  globalPayload = {
    quantity: {
      broilers: broilersCartQuantity, // Assuming these variables are defined
      kienyeji: kienyejiCartQuantity,
    },
    totalprice: totalPrice,
    broilers: broilersCartQuantity > 0, // Boolean indicating whether there are broilers in the cart
    kienyeji: kienyejiCartQuantity > 0, // Boolean indicating whether there are kienyeji in the cart
    name: formData.get("name"),
    phone:
      formData.get("phone-option") === "no"
        ? formData.get("phone-number")
        : formData.get("mpesa-number"),
    location: formData.get("location") || "mombasa",
    mpesa_number: formData.get("mpesa-number"),
  };

  console.log("Sending payload:", globalPayload);

  try {
    // Send the form data using fetch
    const response = await fetch("http://localhost:8078/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(globalPayload),
    });

    // Handle the response
    const data = await response.json();
    console.log("Payment processed:", data);

    // Check if the response was successful
    if (data.success && data.checkoutRequestId) {
      const checkoutRequestId = data.checkoutRequestId; // Store the received checkoutRequestId

      async function checkStatus() {
        try {
          // Fetch the transaction status from your endpoint
          let response = await fetch(
            `https://kukuplaza:8080/check-transaction-status?checkoutRequestId=${checkoutRequestId}`
          );
          let result = await response.json();

          return result;
        } catch (error) {
          console.error("Error checking transaction status:", error);
          return { status: "error" }; // Return a default status in case of an error
        }
      }

      // Polling logic to check the status every 3 seconds
      let pollInterval = setInterval(async () => {
        let result = await checkStatus(); // Fetch the current transaction status

        if (result.status === "pending") {
          console.log("pending");
        } else if (result.status === "complete") {
          console.log("complete");
          document
            .getElementById("payment-successfull")
            .classList.remove("hidden");
          document.getElementById("checkout-form").classList.add("hidden");
          clearInterval(pollInterval); // Stop polling when payment is complete
          checkoutRequestIdstr += `${checkoutRequestId}`;//making the checkoutId global
          console.log("checkout",checkoutRequestIdstr)
          console.log("global ",globalPayload)
        } else if (result.status === "failed") {
          console.log("Payment failed");
          document.getElementById("payment-failed").classList.remove("hidden")
          document.getElementById("payment-failed").classList.add("shake-location")
          document.getElementById("checkout-form").style.opacity = "1";
          document.getElementById("checkout-form").style.pointerEvents = "auto"
          document.getElementById("checkout").style.display = "inline-block";
          document.getElementById("checkout-svg").classList.remove("hidden"); // show the checkout SVG
          document.getElementById("loader-checkout").classList.add("hidden"); // hide the loader
          clearInterval(pollInterval); // Stop polling if payment failed
        }
      }, 3000); // Poll every 3 seconds
    } else {
      console.error("Failed to process request:", data.message);
    }
  } catch (error) {
    // Handle errors
    console.error("Error processing payment:", error);
  }

  return false; // Prevent form from submitting and reloading the page
}

function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    document.getElementById("location").textContent =
      "Geolocation is not supported by this browser.";
  }
}

// Function to display the position (latitude and longitude)
// function showPosition(position) {
//     const latitude = position.coords.latitude;
//     const longitude = position.coords.longitude;
//     var requestOptions = {
//         method: 'GET',
//     };

//     fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=06b108a356d547b894668bfe56d0d78c`, requestOptions)
//         .then(response => response.json())
//         .then(result => {
//             console.log(result);
//             document.getElementById('location').textContent = `Latitude: ${latitude}, Longitude: ${longitude}, Address: ${result.features[0].properties.formatted}`;
//         })
//         .catch(error => {
//             console.log('error', error);
//             document.getElementById('location').textContent = "Error fetching address information.";
//         });
// }

// Function to show the animation
function fetchingLocationAnimation() {
  if (document.getElementById("address").readOnly) {
    document.getElementById("change-location").classList.add("hidden"); //hides choose another
    document.getElementById("current-location").classList.remove("hidden"); //adds
    document.getElementById("address").value = "";
    document.getElementById("address").style.opacity = "1";
  } else {
    document.getElementById("location-button-svg").classList.add("hidden"); // Hides the SVG icon
    document.getElementById("current-location").classList.add("hidden");
    document
      .getElementById("location-button-loader")
      .classList.remove("hidden"); // Shows the loader
  }
}

// Function to handle button click and coordinate the animation and location fetch
function handleLocationButtonClick() {
  fetchingLocationAnimation(); // First, start the animation

  if (!document.getElementById("address").readOnly) {
    // Delay the fetching of the user's location to allow the animation to run smoothly
    setTimeout(function () {
      getUserLocation(); // Then fetch the user's location after a brief delay
    }, 100); // You can adjust the delay as needed
  } else {
    document.getElementById("address").readOnly = false;
  }
}

function showPosition(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  console.log(latitude);
  console.log(longitude);
  var requestOptions = {
    method: "GET",
  };

  fetch(
    `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=06b108a356d547b894668bfe56d0d78c`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      const region = result.features[0].properties.region; // Checking for the county or state
      const state = result.features[0].properties.state;
      const county = result.features[0].properties.county;
      const city = result.features[0].properties.city;
      console.log(`You are in ${region}`);
      // Check if the user is in Mombasa, Kilifi, or Kwale
      if (region === "Coast") {
        // allowing checkout button
        document.getElementById("proceed-to-checkout").disabled = false; //enables checkout button
        document.getElementById("proceed-to-checkout").style.backgroundColor =
          "#ff0000"; //changes its background color to show being active
        document.getElementById(
          "address"
        ).value = `${state}, ${county}, ${city}`; //fills the input on location automatically
        document.getElementById("address").readOnly = true; //makes it to readonly so that users cannot change it
        document.getElementById("address").style.opacity = "0.5";
        document.getElementById("change-location").classList.remove("hidden");
        document
          .getElementById("location-button-loader")
          .classList.add("hidden"); //removes the loading animation
        const notInLocationElement = document.getElementById("not-in-location");
        notInLocationElement.classList.add("hidden"); //hides this just incase it was visible
      } else {
        console.log("in else country");
        // Select the element
        const notInLocationElement = document.getElementById("not-in-location");
        // Update the text content with the message
        notInLocationElement.textContent = `Sorry, we are not in your region yet.`;
        // Remove the animation class if it exists to reset the animation
        notInLocationElement.classList.remove("shake-location");
        // Force reflow (re-render) to restart the animation
        void notInLocationElement.offsetWidth;
        // Add the animation class to trigger the shake effect
        notInLocationElement.classList.add("shake-location");
        // Show the element if it is hidden
        notInLocationElement.classList.remove("hidden");
        // Add logic to prevent the user from proceeding, e.g., disabling a button
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
}

// Function to handle possible errors
function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      document.getElementById("location").textContent =
        "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      document.getElementById("location").textContent =
        "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      document.getElementById("location").textContent =
        "The request to get user location timed out.";
      break;
    case error.UNKNOWN_ERROR:
      document.getElementById("location").textContent =
        "An unknown error occurred.";
      break;
  }
}

// getUserLocation()

let userLocation = "mombasa";

// function useCurrentLocation() {
//     // Get the input fields
//     var addressInput = document.getElementById('address');
//     var currentLocationInput = document.getElementById('current-location');

//     // Update the value and styles
//     addressInput.value = currentLocationInput.value;  // Set the value of the address input to match the current location input
//     addressInput.readOnly = true;  // Make it readonly
//     addressInput.style.border = '1px solid #7ac142';  // Style to match the second input (you can adjust this as needed)
//     addressInput.style.backgroundColor = '#eee';  // Style to match the second input (you can adjust this as needed)

//     // Hide the current location input if necessary
//     currentLocationInput.style.display = 'none';
// }

function handleInput() {
  console.log("Input value changed!");
}

function fetchAutocompleteData() {
  const query = document.getElementById("address").value;
  console.log(`this is my query ${query}`);
  const apiKey = "06b108a356d547b894668bfe56d0d78c";
  const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
    query
  )}&format=json&apiKey=${apiKey}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json(); // Parse the JSON response
    })
    .then((data) => {
      console.log("Autocomplete data:", data); // Handle the data (e.g., display in the UI)
      let divAutocompleteElement = document.getElementById(
        "autocomplete-results"
      );
      divAutocompleteElement.innerHTML = ""; //clears the div to present fresh results
      data.results.forEach((result) => {
        const addressline1 = result.address_line1;
        const addressline2 = result.address_line2;
        let divAutocompleteElement = document.getElementById(
          "autocomplete-results"
        );
        divAutocompleteElement.innerHTML += `
                <div onclick="useCustomLocation('${result.country}','${result.region}', '${result.state}', '${result.county}', '${result.name}')" class="pointer">
                    <h5 class="mt-0 mb-0 ml-2">${addressline1}</h5>
                    <p class="ml-2 mb-1">${addressline2}</p>
                    <hr class="my-0">
                </div>            
                `;
      });
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error); // Handle the error
    });
}

function useCustomLocation(country, region, state, county, name) {
  //
  console.log("country:", country);
  if (country === "Kenya" && region === "Coast") {
    document.getElementById("address").value = `${state}, ${county}, ${name}`; //fills the input on location automatically
    let divAutocompleteElement = document.getElementById(
      "autocomplete-results"
    );
    divAutocompleteElement.innerHTML = "";
    document.getElementById("proceed-to-checkout").style.backgroundColor =
      "#ff0000";
    document.getElementById("proceed-to-checkout").disabled = false;
    const notInLocationElement = document.getElementById("not-in-location");
    notInLocationElement.classList.add("hidden"); //hides this just incase it was visible
  } else {
    let location = region || state;
    console.log("in else country");
    // Select the element
    const notInLocationElement = document.getElementById("not-in-location");
    // Update the text content with the message
    notInLocationElement.textContent = `Sorry, we are not in ${location} region yet.`;
    // Remove the animation class if it exists to reset the animation
    notInLocationElement.classList.remove("shake-location");
    // Force reflow (re-render) to restart the animation
    void notInLocationElement.offsetWidth;
    // Add the animation class to trigger the shake effect
    notInLocationElement.classList.add("shake-location");
    // Show the element if it is hidden
    notInLocationElement.classList.remove("hidden");
  }
}

// Example usage: Fetch autocomplete suggestions for an address
// fetchAutocompleteData('Lessingstraße 3, Regensburg');

//mouse tracking
// Variables to track dragging state
let isDragging = false;
let startX, startY;

function initialDragState(event) {
  // Access event properties like event.clientX, event.clientY, etc.
  console.log("Drag started at:", event.clientX, event.clientY);
  // Your initial drag logic here
  isDragging = true;
  startX = event.clientX;
  startY = event.clientY;
  document.getElementById("drag-line").style.cursor = "grabbing";
}

function moveCloseCart(event) {
  // Use the event object to track the mouse movement
  console.log("Dragging at:", event.clientX, event.clientY);
  // Your drag move logic here
}

function finalDragStage(event) {
  // Finalize the drag operation, check conditions for closing the cart
  console.log("Drag ended at:", event.clientX, event.clientY);
  // Your final drag logic here
}

// pdf function

async function generatePDF() {
  console.log("checkout",checkoutRequestIdstr)
  console.log("payload",globalPayload)
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p", "pt", "a4");

  let startY = 50;
  const pageWidth = doc.internal.pageSize.getWidth();
  const tableColumnWidth = (pageWidth - 60) / 4; // Calculate width for table columns

  // Header: Company Name and Logo
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("KUKUPLAZA", 40, startY);

  startY += 40; // Move Y position down

  // Receipt Header
  doc.setFontSize(16);
  doc.text(`Receipt: ${checkoutRequestIdstr}`, 40, startY);
  startY += 20; // Move Y position down
  doc.setLineWidth(0.5);
  doc.line(40, startY, pageWidth - 40, startY); // Draw horizontal line
  startY += 10;

  // Customer Details
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text("Customer Details", 40, startY);
  startY += 15;
  doc.setFontSize(10);
  doc.text(`Name: ${globalPayload.name}`, 40, startY);
  startY += 10;
  doc.text(`Phone: ${globalPayload.phone}`, 40, startY);
  startY += 10;
  doc.text(`Location: ${globalPayload.location}`, 40, startY);

  startY += 25; // Move Y position down for next section

  // Payment Information
  doc.setFontSize(12);
  doc.text("Payment Information", 40, startY);
  startY += 15;
  doc.setFontSize(10);
  doc.text("Payment Method: Mpesa", 40, startY);
  startY += 10;
  doc.text(`Mpesa Number Used: ${globalPayload.mpesa_number}`, 40, startY);

  startY += 25; // Move Y position down for next section

  // Table Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setFillColor(220, 220, 220); // Light gray background
  doc.rect(40, startY, tableColumnWidth, 20, "F");
  doc.rect(40 + tableColumnWidth, startY, tableColumnWidth, 20, "F");
  doc.rect(40 + 2 * tableColumnWidth, startY, tableColumnWidth, 20, "F");
  doc.rect(40 + 3 * tableColumnWidth, startY, tableColumnWidth, 20, "F");
  doc.setTextColor(0);
  doc.text("Item", 45, startY + 14);
  doc.text("Unit Price", 45 + tableColumnWidth, startY + 14);
  doc.text("Quantity", 45 + 2 * tableColumnWidth, startY + 14);
  doc.text("Total", 45 + 3 * tableColumnWidth, startY + 14);

  startY += 20; // Move Y position down for table rows

  // Dynamic Table Content (Goods Bought)
  let goodsBought = [
    { item: "Broilers", price: broilers, quantity: broilersCartQuantity },
    { item: "Kienyeji", price: kienyeji, quantity: kienyejiCartQuantity },
    { item: "Eggs", price: eggs, quantity: eggsCartQuantity },
  ];

  goodsBought.forEach((good) => {
    if (good.quantity > 0) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.rect(40, startY, tableColumnWidth, 20); // Item column
      doc.rect(40 + tableColumnWidth, startY, tableColumnWidth, 20); // Unit Price column
      doc.rect(40 + 2 * tableColumnWidth, startY, tableColumnWidth, 20); // Quantity column
      doc.rect(40 + 3 * tableColumnWidth, startY, tableColumnWidth, 20); // Total column
      doc.text(good.item, 45, startY + 14);
      doc.text(`${good.price}`, 45 + tableColumnWidth, startY + 14);
      doc.text(`${good.quantity}`, 45 + 2 * tableColumnWidth, startY + 14);
      doc.text(
        `${good.price * good.quantity}`,
        45 + 3 * tableColumnWidth,
        startY + 14
      );
      startY += 20; // Move Y position down for next row
    }
  });

  // Final Total Row
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  // doc.text("======", 45 + 3 * tableColumnWidth, startY + 14);

  // Footer
  doc.setFont("playpen-sans-thanks");
  doc.setFontSize(16);
  startY += 50;
  doc.text("KUKUPLAZA - SOURCE OF PREMIUM MEAT", pageWidth / 2, startY, {
    align: "center",
  });
  doc.setLineWidth(0.5);
  startY += 10;
  doc.line(40, startY, pageWidth - 40, startY);

  // Save the PDF
  await doc.save("document.pdf");
}


function redirectToPage() {
  window.location.href = "../products.html"; // Replace with your desired URL
}

