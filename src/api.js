// src/api.js

// fragments microservice API
const apiUrl = process.env.API_URL;
var Buffer = require('buffer/').Buffer;
const fs = require('fs');
/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragments(user) {
  console.log('Requesting user fragments data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      headers: {
        // Include the user's ID Token in the request so we're authorized
        Authorization: `Bearer ${user.idToken}`,
      },
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Got user fragments data', { data });
  } catch (err) {
    console.error('Unable to call GET /v1/fragment', { err });
  }
}

export async function postData(user,data,contentType) {
  const response = await fetch(`${apiUrl}/v1/fragments`, {
    method: 'POST',
    headers: {
      'Content-Type': contentType,
      Authorization: `Bearer ${user.idToken}`,
    },
    body: data,
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  const data1 = await response.json();
  
  console.log('Response to Post', { data1 });
  document.getElementById("res").innerHTML += '<p>'  +    `Please note the Id ------->` + '<b>' + `${data1.fragment.id}`  + '</b>' + `<---------  `+ '</p>';

}

//GET /:id
export async function getData(user,id) {
  const response = await fetch(`${apiUrl}/v1/fragments/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${user.idToken}`,
    },
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  const data1 = await response.text();
  const data = Buffer.from(data1);
  let meta = await getMetaData(user,id);
  if(meta.includes('image')){
     const myBlob = await data.blob();
      var image = document.createElement('img');
      image.src = URL.createObjectUrl(myBlob);
      document.body.appendChild(image);
  }
  else{
    document.getElementById("frag").innerHTML += '<p>'  +    `Please note ------->` + '<b>' + `${data1}`  + '</b>' + `<---------  `+ '</p>';
  }

}


export async function getMetaData(user,id) {
  const response = await fetch(`${apiUrl}/v1/fragments/${id}/info`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${user.idToken}`,
    },
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  
  const data1 = await response.text();
  
  console.log('Response to GET MetaData', ` ${data1} `);
  
 //console.log('MetaData type', ` ${data1.fragment} `);
 document.getElementById("metafrag").innerHTML += '<p>'  +    `Please note ------->` + '<b>' + `${data1}`  + '</b>' + `<---------  `+ '</p>';
 return data1;
}


export async function updateData(user,data,contentType,url) {
  const response = await fetch(`${apiUrl}/v1/fragments/${url}`, {
    method: 'PUT',
    headers: {
      'Content-Type': contentType,
      Authorization: `Bearer ${user.idToken}`,
    },
    body: data,
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  const data1 = await response.json();
  console.log('Response to Post', { data1 });
}

export async function deleteData(user, urlID) {
  const response = await fetch(`${apiUrl}/v1/fragments/${urlID}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${user.idToken}`,
    }
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  const data1 = await response.json();
  console.log('Response to Post', { data1 });

}


export async function getUserFragmentsList(user) {
  console.log('Requesting user fragments list...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments?expand=1`, {
      headers: {
        // Include the user's ID Token in the request so we're authorized
        Authorization: `Bearer ${user.idToken}`,
      },
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json(); 

    console.log('Got user\'s existing fragments metadata', { data });
    try{
        if(data.fragments[0] ==null){
          console.log('No existing fragment saved in the system');
        }else{
          for (let i = 0; i<data.fragments.length; i++) {
            // document.getElementById("demo").innerHTML += '<p>'  +    `User\'s existing fragment data ------->` + '<b>' + `${data.fragments[i]}`  + '</b>' + `<--------- for id:  <b>   </b> `+ '</p>';

            const frag = await fetch(`${apiUrl}/v1/fragments/${data.fragments[i].id}`, {
              headers: {
                // Include the user's ID Token in the request so we're authorized
                Authorization: `Bearer ${user.idToken}`,
              },
            });
            const fragment = await frag.text();
            document.getElementById("demo").innerHTML += '<p>'  +    `User\'s existing fragment data ------->` + '<b>' + `${fragment}`  + '</b>' + `<--------- for id:  <b>  ${data.fragments[i].id}</b> of content type:<b> ${data.fragments[i].type}</b> `+ '</p>';
            console.log('User\'s existing fragment data ------->', `${fragment}` , '<--------- for id:',` ${data.fragments[i].id} `);
          }
        }
    }catch (err) {
      console.error('Unable to call GET /v1/fragment/:id because there is no data stored', { err });
    }
   
    
    
  } catch (err) {
    console.error('Unable to call GET /v1/fragment?expand=1', { err });
  }
}

