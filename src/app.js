// src/app.js
import { Auth, getUser } from './auth';
import { getUserFragments , getUserFragmentsList, postData, updateData, deleteData, getData, getMetaData} from './api';
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
   let content = form.elements.value1.value;
   let url=form.elements.value2.value;
   let contentType=form.elements.value3.value;
   let data=form.elements.value4.value;
   let urlID=form.elements.value5.value;
   let id=form.elements.value6.value;
   let metaid=form.elements.value7.value;
   
    event.preventDefault();
    if(frag!=''){
      postData(user,frag,content);
      console.log("Saving Fragment value:", frag);
      console.log("Saving Fragment content type:", content);
      form.reset();
    }
   
    if(url!=''){
      updateData(user,data,contentType,url);
      console.log("Saving New Fragment Data :", data);
      form.reset();
    }
    if(urlID!=''){
      deleteData(user,urlID);
      console.log("Fragment have been deleted :", data);
      form.reset();
    }
    
    if(id!=''){
    getData(user,id);
    form.reset();
    }
    
    if(metaid!=''){
      getMetaData(user,metaid);
      form.reset();
      }
    
  });
}
addEventListener('DOMContentLoaded', init);