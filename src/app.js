// src/app.js
import { Auth, getUser } from './auth';
import { getUserFragments , getUserFragmentsList, postData} from './api';
async function init() {

  // Get our UI elements
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');
  const logoutBtn = document.querySelector('#logout');

  // Wire up event handlers to deal with login and logout.
  loginBtn.onclick = () => {
    // Sign-in via the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation
    Auth.federatedSignIn();
  };
  logoutBtn.onclick = () => {
    // Sign-out of the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#sign-out
    Auth.signOut();
  };

  const user = await getUser();
  if (!user) {
    // Disable the Logout button
    logoutBtn.disabled = true;
    return;
  }

  // Do an authenticated request to the fragments API server and log the result
  getUserFragments(user);
  getUserFragmentsList(user);

  // Log the user info for debugging purposes
  console.log({ user });

  // Update the UI to welcome the user
  userSection.hidden = false;

  // Show the user's username
  userSection.querySelector('.username').innerText = user.username;

  loginBtn.disabled = true;


  //Get form data and pass it to postData that posts the fragment
  var form = document.querySelector("form");
  form.addEventListener("submit", function(event) {
    let frag = form.elements.value.value;
  //  var content = inputs["value1"];
   let content = form.elements.value1.value;
    console.log("Saving Fragment value:", frag);
    console.log("Saving Fragment content type:", content);
    event.preventDefault();
    postData(user,frag,content);
  });
}


addEventListener('DOMContentLoaded', init);